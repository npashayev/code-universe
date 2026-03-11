'use client';

import { deletePlanet } from '@/app/actions/deletePlanet';
import { updatePlanetList } from '@/app/actions/planet';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeletePlanet = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: deletePlanet,
    onSuccess: () => {
      toast.success('Planet deleted successfully');
      onSuccess?.();
    },
    onError: err => toast.error(err.message),
  });

export const useUpdatePlanetList = () =>
  useMutation({
    mutationFn: updatePlanetList,
    onSuccess: () => toast.success('Planet list updated successfully'),
    onError: err => toast.error(err.message),
  });
