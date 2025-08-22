import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Affiliate } from '@/types/affiliate';

interface SearchHistoryData {
  searchType: 'simple' | 'advanced';
  searchParams: any;
  resultFound: boolean;
  resultData?: Affiliate;
}

export function useSearchHistory() {
  const queryClient = useQueryClient();

  const addToHistoryMutation = useMutation({
    mutationFn: async (data: SearchHistoryData) => {
      const response = await fetch('/api/search-history', {
        method: 'POST',
        body: JSON.stringify({
          searchType: data.searchType,
          searchParams: data.searchParams,
          resultFound: data.resultFound.toString(),
          resultData: data.resultData || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to save search history');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/search-history'] });
    },
  });

  const addToHistory = (data: SearchHistoryData) => {
    addToHistoryMutation.mutate(data);
  };

  return {
    addToHistory,
    isLoading: addToHistoryMutation.isPending,
  };
}