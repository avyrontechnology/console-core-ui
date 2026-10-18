"use client";

import { useCallback, useEffect, useState } from "react";

import { usersApi } from "./api";
import type {
  CreateUserInput,
  PaginatedUsers,
  Role,
  UpdateUserInput,
  User,
  UserListParams,
} from "@/types/user";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const idle = <T>(data: T | null = null): AsyncState<T> => ({
  data,
  isLoading: false,
  error: null,
});

/** GET /users is 1-based: offset must be >= 1 or the API 422s. */
const FIRST_PAGE_OFFSET = 1;

/** Paginated user list. Local state — no cross-screen cache needs Redux. */
export function useUsers(params?: UserListParams) {
  const [state, setState] = useState<AsyncState<PaginatedUsers>>(
    idle({
      total_count: 0,
      limit: params?.limit ?? 20,
      offset: params?.offset ?? FIRST_PAGE_OFFSET,
      users_data: [],
    }),
  );
  const offset = params?.offset ?? FIRST_PAGE_OFFSET;
  const limit = params?.limit ?? 20;

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await usersApi.list({ offset, limit });
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: { total_count: 0, limit, offset, users_data: [] },
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load users",
      });
    }
  }, [offset, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    users: state.data?.users_data ?? [],
    totalCount: state.data?.total_count ?? 0,
    refresh,
  };
}

export function useUser(id: string | null) {
  const [state, setState] = useState<AsyncState<User>>(idle());

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    usersApi
      .getById(id)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to load user",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export function useRoles() {
  const [state, setState] = useState<AsyncState<Role[]>>(idle([]));

  useEffect(() => {
    let cancelled = false;
    usersApi
      .roles()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to load roles",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

interface MutationState {
  isSaving: boolean;
  error: string | null;
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

export function useCreateUser() {
  const [state, setState] = useState<MutationState>({
    isSaving: false,
    error: null,
  });

  const create = useCallback(async (input: CreateUserInput): Promise<User> => {
    setState({ isSaving: true, error: null });
    try {
      const user = await usersApi.create(input);
      setState({ isSaving: false, error: null });
      return user;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, create };
}

export function useUpdateUser() {
  const [state, setState] = useState<MutationState>({
    isSaving: false,
    error: null,
  });

  const update = useCallback(async (id: string, input: UpdateUserInput): Promise<User> => {
    setState({ isSaving: true, error: null });
    try {
      const user = await usersApi.update(id, input);
      setState({ isSaving: false, error: null });
      return user;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, update };
}

export function useDeleteUser() {
  const [state, setState] = useState<MutationState>({
    isSaving: false,
    error: null,
  });

  const remove = useCallback(async (id: string): Promise<void> => {
    setState({ isSaving: true, error: null });
    try {
      await usersApi.remove(id);
      setState({ isSaving: false, error: null });
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, remove };
}
