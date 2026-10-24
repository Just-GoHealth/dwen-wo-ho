"use client";

import { useState, useCallback, useMemo } from "react";
import { useProvidersQuery } from "@/hooks/queries/use-provider";
import { Provider } from "@/lib/types/entities/provider";
import {
  formatProviderName,
  getProviderTitle,
} from "@/lib/utils/shared/provider-name";

export function useCuratorProviders() {
  const [filter, setFilter] = useState("All");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modalProviderId, setModalProviderId] = useState("");
  const [currentAction, setCurrentAction] = useState<
    "approving" | "rejecting" | null
  >(null);

  const {
    providers,
    isLoading,
    isError,
    error,
    approveProvider,
    rejectProvider,
  } = useProvidersQuery();

  // Keyed by provider id (UUID); v2 provider summaries carry no email.
  const providersList: Provider[] = useMemo(() => providers ?? [], [providers]);

  const handleProviderSelect = useCallback((providerId: string) => {
    setSelectedProviderId(providerId);
    setShowProviderModal(true);
  }, []);

  const handleShowApproveModal = useCallback((providerId: string) => {
    setModalProviderId(providerId);
    setShowApproveModal(true);
  }, []);

  const handleShowRejectModal = useCallback((providerId: string) => {
    setModalProviderId(providerId);
    setShowRejectModal(true);
  }, []);

  const handleApproveConfirm = useCallback(() => {
    setShowApproveModal(false);
    setCurrentAction("approving");
    approveProvider(modalProviderId, {
      onSettled: () => {
        setCurrentAction(null);
        setModalProviderId("");
      },
    });
  }, [approveProvider, modalProviderId]);

  const handleRejectConfirm = useCallback(() => {
    setShowRejectModal(false);
    setCurrentAction("rejecting");
    rejectProvider(modalProviderId, {
      onSettled: () => {
        setCurrentAction(null);
        setModalProviderId("");
      },
    });
  }, [rejectProvider, modalProviderId]);

  const getProviderName = useCallback(
    (providerId: string) => {
      const provider = providersList.find((p) => p.id === providerId);
      if (!provider) return "";
      return formatProviderName(
        provider.providerName || "",
        provider.providerTitle,
      );
    },
    [providersList],
  );

  const filteredProviders = useMemo(
    () =>
      providersList.filter((provider) => {
        if (filter === "All") return true;
        return (
          provider?.applicationStatus?.toLowerCase() === filter?.toLowerCase()
        );
      }),
    [providersList, filter],
  );

  const filterOptions = useMemo(
    () => [
      {
        id: "All",
        label: "All Providers",
        color: "bg-primary",
        hoverColor: "hover:bg-foreground/10",
        inactiveColor: "bg-muted/10 text-muted-foreground/70",
        count: providersList.length,
      },
      {
        id: "PENDING",
        label: "Pending",
        color: "bg-yellow-500",
        hoverColor: "hover:bg-foreground/10",
        inactiveColor: "bg-muted/10 text-muted-foreground/70",
        count: providersList.filter((p) => p.applicationStatus === "PENDING")
          .length,
      },
      {
        id: "APPROVED",
        label: "Approved",
        color: "bg-green-600",
        hoverColor: "hover:bg-foreground/10",
        inactiveColor: "bg-muted/10 text-muted-foreground/70",
        count: providersList.filter((p) => p.applicationStatus === "APPROVED")
          .length,
      },
      {
        id: "REJECTED",
        label: "Rejected",
        color: "bg-red-600",
        hoverColor: "hover:bg-foreground/10",
        inactiveColor: "bg-muted/10 text-muted-foreground/70",
        count: providersList.filter((p) => p.applicationStatus === "REJECTED")
          .length,
      },
    ],
    [providersList],
  );

  const selectedProvider = useMemo(() => {
    const foundProvider = providersList.find(
      (p) => p.id === selectedProviderId,
    );
    if (!foundProvider) return undefined;
    return {
      id: foundProvider.id,
      email: foundProvider.email,
      fullName: formatProviderName(
        foundProvider.providerName || "",
        foundProvider.providerTitle,
      ),
      providerTitle:
        getProviderTitle(
          foundProvider.providerName || "",
          foundProvider.providerTitle,
        ) || undefined,
      professionalTitle: foundProvider.specialty || undefined,
      profileImage: foundProvider.profilePhotoURL || undefined,
      officePhoneNumber: foundProvider.officePhoneNumber || undefined,
      createdAt: foundProvider.applicationDate,
      updatedAt: foundProvider.lastActive || foundProvider.applicationDate,
      applicationStatus: foundProvider.applicationStatus,
    };
  }, [providersList, selectedProviderId]);

  return {
    // Query state
    isLoading,
    isError,
    error,

    // Data
    providersList,
    filteredProviders,
    filterOptions,
    selectedProvider,

    // Filter
    filter,
    setFilter,

    // Modal state
    showProviderModal,
    setShowProviderModal,
    selectedProviderId,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    modalProviderId,
    setModalProviderId,
    currentAction,

    // Handlers
    handleProviderSelect,
    handleShowApproveModal,
    handleShowRejectModal,
    handleApproveConfirm,
    handleRejectConfirm,
    getProviderName,
  };
}
