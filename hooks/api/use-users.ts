"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/lib/api/users";
import { queryKeys } from "@/lib/query/keys";

export function useAllUsers(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: getAllUsers,
    enabled,
  });
}
