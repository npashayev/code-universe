import { deletePlanet } from '@/app/actions/planet';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeletePlanet = () =>
  useMutation({
    mutationFn: deletePlanet,
    onSuccess: () => toast.success('Planet deleted successfully'),
    onError: err => toast.error(err.message),
  });
