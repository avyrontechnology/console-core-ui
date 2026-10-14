"use client";

import { useCallback, useEffect, useState } from "react";

import { rbacApi } from "./api";
import type {
  CreateRoleInput,
  MatrixResponse,
  Permission,
  Role,
  UpdateRoleInput,
} from "@/types/rbac";

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

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Request failed";
}

interface MutationState {
  isSaving: boolean;
  error: string | null;
}

const idleMutation: MutationState = { isSaving: false, error: null };

export function useRoles() {
  const [state, setState] = useState<AsyncState<Role[]>>(idle([]));

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await rbacApi.roles();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: [], isLoading: false, error: toMessage(error) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useRole(id: string | null) {
  const [state, setState] = useState<AsyncState<Role>>(idle());

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    rbacApi
      .roleById(id)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ data: null, isLoading: false, error: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export function usePermissionList() {
  const [state, setState] = useState<AsyncState<Permission[]>>(idle([]));

  useEffect(() => {
    let cancelled = false;
    rbacApi
      .permissions()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ data: [], isLoading: false, error: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function usePermissionMatrix() {
  const [state, setState] = useState<AsyncState<MatrixResponse>>(idle());

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await rbacApi.matrix();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: toMessage(error) });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useCreateRole() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const create = useCallback(async (input: CreateRoleInput): Promise<Role> => {
    setState({ isSaving: true, error: null });
    try {
      const role = await rbacApi.createRole(input);
      setState({ isSaving: false, error: null });
      return role;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, create };
}

export function useUpdateRole() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const update = useCallback(async (id: string, input: UpdateRoleInput): Promise<Role> => {
    setState({ isSaving: true, error: null });
    try {
      const role = await rbacApi.updateRole(id, input);
      setState({ isSaving: false, error: null });
      return role;
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, update };
}

export function useDeleteRole() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const remove = useCallback(async (id: string): Promise<void> => {
    setState({ isSaving: true, error: null });
    try {
      await rbacApi.deleteRole(id);
      setState({ isSaving: false, error: null });
    } catch (error) {
      setState({ isSaving: false, error: toMessage(error) });
      throw error;
    }
  }, []);

  return { ...state, remove };
}

export function useSetRoleActionPermissions() {
  const [state, setState] = useState<MutationState>(idleMutation);

  const save = useCallback(
    async (
      roleId: string,
      partnerId: string,
      permissions: Record<string, boolean>,
    ): Promise<void> => {
      setState({ isSaving: true, error: null });
      try {
        await rbacApi.setRoleActionPermissions(roleId, partnerId, permissions);
        setState({ isSaving: false, error: null });
      } catch (error) {
        setState({ isSaving: false, error: toMessage(error) });
        throw error;
      }
    },
    [],
  );

  return { ...state, save };
}
