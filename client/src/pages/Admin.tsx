import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther, stringToHex, pad } from "viem";
import { theme } from "@/styles/theme";
import { Header, Footer } from "@/components/layout";
import { useEpisodes } from "@/hooks/useEpisodes";
import { EpisodeFactoryABI, EPISODE_FACTORY_ADDRESS } from "@/contracts/abis";
import { EpisodeState } from "@/types/episode";
import * as episodeUtils from "@/utils/episode";

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.backgroundGradient};
`;

const Content = styled.div`
  padding: 120px ${theme.spacing.xl} ${theme.spacing.xxxl};
  max-width: 1200px;
  margin: 0 auto;
`;

const GlassCard = styled(motion.div)`
  background: ${theme.colors.glass};
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.secondary};
  border-bottom: 1px solid ${theme.colors.glassBorder};
  padding-bottom: ${theme.spacing.sm};
`;

const InputGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.md};
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 0 2px ${theme.colors.secondary}20;
  }
`;

const Button = styled.button<{
  variant?: "outline" | "gradient" | "danger" | "success";
}>`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;

  ${({ variant }) => {
    switch (variant) {
      case "gradient":
        return `
          background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.secondaryDark});
          color: ${theme.colors.background};
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px ${theme.colors.secondary}40;
          }
        `;
      case "danger":
        return `
          background: ${theme.colors.error}20;
          border: 1px solid ${theme.colors.error}40;
          color: ${theme.colors.error};
          &:hover:not(:disabled) {
            background: ${theme.colors.error}30;
          }
        `;
      case "success":
        return `
          background: ${theme.colors.success}20;
          border: 1px solid ${theme.colors.success}40;
          color: ${theme.colors.success};
          &:hover:not(:disabled) {
            background: ${theme.colors.success}30;
          }
        `;
      case "outline":
      default:
        return `
          background: transparent;
          border: 1px solid ${theme.colors.glassBorder};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background: ${theme.colors.glassBorder};
            border-color: ${theme.colors.secondary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span<{
  variant?: "secondary" | "success" | "warning" | "error";
}>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  background: ${({ variant }) => {
    if (variant === "success") return `${theme.colors.success}20`;
    if (variant === "warning") return `${theme.colors.warning}20`;
    if (variant === "error") return `${theme.colors.error}20`;
    return `${theme.colors.secondary}20`;
  }};
  border: 1px solid
    ${({ variant }) => {
      if (variant === "success") return `${theme.colors.success}40`;
      if (variant === "warning") return `${theme.colors.warning}40`;
      if (variant === "error") return `${theme.colors.error}40`;
      return `${theme.colors.secondary}40`;
    }};
  color: ${({ variant }) => {
    if (variant === "success") return theme.colors.success;
    if (variant === "warning") return theme.colors.warning;
    if (variant === "error") return theme.colors.error;
    return theme.colors.secondary;
  }};
`;

const ErrorBox = styled.div`
  background: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error}20;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const SuccessBox = styled.div`
  background: ${theme.colors.success}10;
  border: 1px solid ${theme.colors.success}20;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.success};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const EpisodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AddressText = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textMuted};
`;

const FlightName = styled.span`
  font-weight: ${theme.fontWeight.semibold};
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid ${theme.colors.glassBorder};
  border-top-color: currentColor;
  border-radius: 50%;
`;

const EpisodeRowLoading = styled.div`
  position: absolute;
  inset: 0;
  background: ${theme.colors.background}80;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  z-index: 10;
`;

const EpisodeRowWrapper = styled.div`
  position: relative;
`;

const EpisodeItemContainer = styled.div`
  border-bottom: 1px solid ${theme.colors.glassBorder};

  &:last-child {
    border-bottom: none;
  }
`;

const EpisodeHeader = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  cursor: pointer;
  transition: background ${theme.transitions.fast};
  border-radius: ${({ $isExpanded }) =>
    $isExpanded
      ? `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
      : theme.borderRadius.md};

  &:hover {
    background: ${theme.colors.surface}50;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const ExpandIcon = styled(motion.div)`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textMuted};
  margin-right: ${theme.spacing.sm};
`;

const EpisodeHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const EpisodeDetails = styled(motion.div)`
  overflow: hidden;
  background: ${theme.colors.surface}30;
  border-radius: 0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg};
`;

const DetailsContent = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.glassBorder};
`;

const DetailSectionTitle = styled.h4`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.glassBorder}50;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textMuted};
`;

const DetailValue = styled.span<{ $highlight?: boolean; $mono?: boolean }>`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${({ $highlight }) =>
    $highlight ? theme.colors.secondary : theme.colors.text};
  font-family: ${({ $mono }) =>
    $mono ? "'JetBrains Mono', monospace" : "inherit"};
`;

const FullAddressBox = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const CopyButton = styled.button`
  background: ${theme.colors.secondary}20;
  border: 1px solid ${theme.colors.secondary}40;
  color: ${theme.colors.secondary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.secondary}30;
  }
`;

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DollarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const Admin = () => {
  const { address: connectedAddress } = useAccount();
  const { episodes, isLoading: isLoadingEpisodes } = useEpisodes();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [pendingEpisode, setPendingEpisode] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productId: "FLIGHT-001",
    flightName: "",
    premiumAmount: "10",
    payoutAmount: "100",
    signupStart: "",
    signupEnd: "",
    departureTime: "",
    estimatedArrivalTime: "",
  });

  const {
    writeContract,
    data: hash,
    isPending,
    error: contractError,
    reset,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["episodeAddresses"] });
      setTimeout(() => {
        setPendingEpisode(null);
        setPendingAction(null);
        reset();
      }, 1000);
    }
  }, [isSuccess, queryClient, reset]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "eventsure2025") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleCreateEpisode = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productIdHex = pad(stringToHex(formData.productId), { size: 32 });
      const premium = parseEther(formData.premiumAmount);
      const payout = parseEther(formData.payoutAmount);

      const signupStartTs = BigInt(
        Math.floor(new Date(formData.signupStart).getTime() / 1000)
      );
      const signupEndTs = BigInt(
        Math.floor(new Date(formData.signupEnd).getTime() / 1000)
      );
      const departureTs = BigInt(
        Math.floor(new Date(formData.departureTime).getTime() / 1000)
      );
      const arrivalTs = BigInt(
        Math.floor(new Date(formData.estimatedArrivalTime).getTime() / 1000)
      );

      writeContract({
        address: EPISODE_FACTORY_ADDRESS,
        abi: EpisodeFactoryABI,
        functionName: "createEpisode",
        args: [
          productIdHex,
          signupStartTs,
          signupEndTs,
          premium,
          payout,
          formData.flightName,
          departureTs,
          arrivalTs,
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = (
    epAddress: `0x${string}`,
    action: "open" | "lock" | "close"
  ) => {
    setPendingEpisode(epAddress);
    setPendingAction(action);

    const functionName =
      action === "open"
        ? "openEpisode"
        : action === "lock"
        ? "lockEpisode"
        : "closeEpisode";

    writeContract({
      address: EPISODE_FACTORY_ADDRESS,
      abi: EpisodeFactoryABI,
      functionName: functionName as any,
      args: [epAddress],
    });
  };

  const getNextStateLabel = (action: "open" | "lock" | "close") => {
    switch (action) {
      case "open":
        return "OPEN";
      case "lock":
        return "LOCKED";
      case "close":
        return "RESOLVED";
    }
  };

  const isEpisodeLoading = (epAddress: string) => {
    return pendingEpisode === epAddress && (isPending || isConfirming);
  };

  const toggleEpisodeExpand = (address: string) => {
    setExpandedEpisode(expandedEpisode === address ? null : address);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: bigint) => {
    if (!timestamp || timestamp === 0n) return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const renderAuthGate = () => (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Title>Admin Access</Title>
      <form onSubmit={handleLogin}>
        <InputGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />
        </InputGroup>
        {authError && <ErrorBox>Invalid password</ErrorBox>}
        <Button variant="gradient" type="submit" style={{ width: "100%" }}>
          Login
        </Button>
      </form>
    </GlassCard>
  );

  const renderDashboard = () => (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard>
          <Subtitle>Connected Wallet</Subtitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AddressText style={{ fontSize: theme.fontSize.md }}>
              {connectedAddress || "Not connected"}
            </AddressText>
            <Badge variant={connectedAddress ? "success" : "error"}>
              {connectedAddress ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </GlassCard>

        <GlassCard>
          <Subtitle>Create New Episode</Subtitle>
          <form onSubmit={handleCreateEpisode}>
            <FormGrid>
              <InputGroup>
                <Label>Product ID (bytes32)</Label>
                <Input
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Flight Name</Label>
                <Input
                  value={formData.flightName}
                  onChange={(e) =>
                    setFormData({ ...formData, flightName: e.target.value })
                  }
                  placeholder="e.g. CX411"
                />
              </InputGroup>
              <InputGroup>
                <Label>Premium (MNT)</Label>
                <Input
                  type="number"
                  value={formData.premiumAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, premiumAmount: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Payout (MNT)</Label>
                <Input
                  type="number"
                  value={formData.payoutAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, payoutAmount: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Signup Start</Label>
                <Input
                  type="datetime-local"
                  value={formData.signupStart}
                  onChange={(e) =>
                    setFormData({ ...formData, signupStart: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Signup End</Label>
                <Input
                  type="datetime-local"
                  value={formData.signupEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, signupEnd: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Departure Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData({ ...formData, departureTime: e.target.value })
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Estimated Arrival</Label>
                <Input
                  type="datetime-local"
                  value={formData.estimatedArrivalTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedArrivalTime: e.target.value,
                    })
                  }
                />
              </InputGroup>
            </FormGrid>

            {contractError && (
              <ErrorBox>
                {contractError.message.includes("User rejected")
                  ? "Transaction rejected by user"
                  : `Error: ${contractError.message.split("\n")[0]}`}
              </ErrorBox>
            )}

            {isSuccess && (
              <SuccessBox>Transaction confirmed successfully!</SuccessBox>
            )}

            <Button
              variant="gradient"
              type="submit"
              disabled={isPending || isConfirming || !connectedAddress}
              style={{ width: "100%", marginTop: theme.spacing.md }}
            >
              {isPending
                ? "Confirming..."
                : isConfirming
                ? "Processing..."
                : "Create Episode"}
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <Subtitle>Manage Episodes</Subtitle>
          {isLoadingEpisodes ? (
            <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
              Loading episodes...
            </div>
          ) : episodes.length === 0 ? (
            <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
              No episodes found.
            </div>
          ) : (
            <div>
              {episodes.map((ep) => {
                const isExpanded = expandedEpisode === ep.address;
                return (
                  <EpisodeItemContainer key={ep.address}>
                    <EpisodeRowWrapper>
                      {isEpisodeLoading(ep.address) && (
                        <EpisodeRowLoading>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: theme.spacing.sm,
                              color: theme.colors.secondary,
                            }}
                          >
                            <LoadingSpinner
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span
                              style={{
                                fontSize: theme.fontSize.sm,
                                fontWeight: theme.fontWeight.medium,
                              }}
                            >
                              {isPending
                                ? "Confirm in wallet..."
                                : `Changing to ${getNextStateLabel(
                                    pendingAction as "open" | "lock" | "close"
                                  )}...`}
                            </span>
                          </div>
                        </EpisodeRowLoading>
                      )}
                      <EpisodeHeader
                        $isExpanded={isExpanded}
                        onClick={() => toggleEpisodeExpand(ep.address)}
                      >
                        <EpisodeHeaderLeft>
                          <ExpandIcon>
                            <ChevronIcon isExpanded={isExpanded} />
                          </ExpandIcon>
                          <EpisodeInfo>
                            <FlightName>{ep.flightName}</FlightName>
                            <AddressText>
                              {ep.address.slice(0, 6)}...{ep.address.slice(-4)}
                            </AddressText>
                          </EpisodeInfo>
                        </EpisodeHeaderLeft>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing.lg,
                          }}
                        >
                          <Badge
                            variant={episodeUtils.getStateBadgeVariant(
                              ep.state
                            )}
                          >
                            {episodeUtils.getStateLabel(ep.state).toUpperCase()}
                          </Badge>

                          <ActionButtons onClick={(e) => e.stopPropagation()}>
                            {ep.state === EpisodeState.Created && (
                              <Button
                                variant="gradient"
                                onClick={() => handleAction(ep.address, "open")}
                                disabled={isPending || isConfirming}
                              >
                                → OPEN
                              </Button>
                            )}
                            {ep.state === EpisodeState.Open && (
                              <Button
                                variant="outline"
                                onClick={() => handleAction(ep.address, "lock")}
                                disabled={isPending || isConfirming}
                              >
                                → LOCKED
                              </Button>
                            )}
                            {ep.state === EpisodeState.Locked && (
                              <Button
                                variant="success"
                                onClick={() =>
                                  handleAction(ep.address, "close")
                                }
                                disabled={isPending || isConfirming}
                              >
                                → RESOLVED
                              </Button>
                            )}
                          </ActionButtons>
                        </div>
                      </EpisodeHeader>
                    </EpisodeRowWrapper>

                    <AnimatePresence>
                      {isExpanded && (
                        <EpisodeDetails
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DetailsContent>
                            <DetailsGrid>
                              <DetailSection>
                                <DetailSectionTitle>
                                  <DollarIcon />
                                  Financial Terms
                                </DetailSectionTitle>
                                <DetailRow>
                                  <DetailLabel>Premium</DetailLabel>
                                  <DetailValue $highlight>
                                    {episodeUtils.formatMNT(ep.premiumAmount)}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Max Payout</DetailLabel>
                                  <DetailValue $highlight>
                                    {episodeUtils.formatMNT(ep.payoutAmount)}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Pool Size</DetailLabel>
                                  <DetailValue>
                                    {episodeUtils.formatMNT(ep.totalPremium)}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Payout Ratio</DetailLabel>
                                  <DetailValue>
                                    {ep.premiumAmount > 0n
                                      ? `${(
                                          Number(ep.payoutAmount) /
                                          Number(ep.premiumAmount)
                                        ).toFixed(1)}x`
                                      : "N/A"}
                                  </DetailValue>
                                </DetailRow>
                              </DetailSection>

                              <DetailSection>
                                <DetailSectionTitle>
                                  <ClockIcon />
                                  Schedule
                                </DetailSectionTitle>
                                <DetailRow>
                                  <DetailLabel>Departure</DetailLabel>
                                  <DetailValue>
                                    {formatTimestamp(ep.departureTime)}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Est. Arrival</DetailLabel>
                                  <DetailValue>
                                    {formatTimestamp(ep.estimatedArrivalTime)}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Duration</DetailLabel>
                                  <DetailValue>
                                    {ep.departureTime && ep.estimatedArrivalTime
                                      ? `${Math.round(
                                          (Number(ep.estimatedArrivalTime) -
                                            Number(ep.departureTime)) /
                                            3600
                                        )}h`
                                      : "N/A"}
                                  </DetailValue>
                                </DetailRow>
                              </DetailSection>

                              <DetailSection>
                                <DetailSectionTitle>
                                  <InfoIcon />
                                  Episode Info
                                </DetailSectionTitle>
                                <DetailRow>
                                  <DetailLabel>State</DetailLabel>
                                  <DetailValue>
                                    {episodeUtils
                                      .getStateLabel(ep.state)
                                      .toUpperCase()}
                                  </DetailValue>
                                </DetailRow>
                                <DetailRow>
                                  <DetailLabel>Participants</DetailLabel>
                                  <DetailValue>
                                    {ep.premiumAmount > 0n
                                      ? Math.floor(
                                          Number(ep.totalPremium) /
                                            Number(ep.premiumAmount)
                                        )
                                      : 0}
                                  </DetailValue>
                                </DetailRow>
                                <FullAddressBox>
                                  <AddressText
                                    style={{
                                      fontSize: theme.fontSize.xs,
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    {ep.address}
                                  </AddressText>
                                  <CopyButton
                                    onClick={() => copyToClipboard(ep.address)}
                                  >
                                    Copy
                                  </CopyButton>
                                </FullAddressBox>
                              </DetailSection>
                            </DetailsGrid>
                          </DetailsContent>
                        </EpisodeDetails>
                      )}
                    </AnimatePresence>
                  </EpisodeItemContainer>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <PageContainer>
      <Header />
      <Content>
        {!isAuthenticated ? renderAuthGate() : renderDashboard()}
      </Content>
      <Footer />
    </PageContainer>
  );
};

export default Admin;
