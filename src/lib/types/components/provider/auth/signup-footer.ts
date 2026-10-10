export type ProviderSignUpMainFooterProps = {
  mode: "main";
  mainStep: "create" | "verify";
  onBack: () => void;
  backDisabled: boolean;
  stepLabel: "Create" | "Verify" | "Profile";
  showNext: boolean;
  nextDisabled: boolean;
};

export type ProviderSignUpProfileFooterProps = {
  mode: "profile";
  profileStep: number;
  onBack: () => void;
  hideBack: boolean;
  onNext: () => void;
  isSubmitting: boolean;
  nextDisabled: boolean;
};

export type ProviderSignUpFooterProps =
  ProviderSignUpMainFooterProps | ProviderSignUpProfileFooterProps;

export type ProfileStepIndicatorProps = {
  currentStep: number;
};
