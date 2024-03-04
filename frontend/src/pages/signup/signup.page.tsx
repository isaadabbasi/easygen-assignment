import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignUpForm } from "src/components";
import { IAuth } from "src/defs";
import { authService, persistantStorageService } from "src/services";
import { constants } from "src/utils";

const { AppRoutes } = constants;
/**
 * @notice - Separation of Concerns
 * Its important to seperate the page logic from the component
 * Pages acts as controllers and components acts as views
 * This is where the logic of the page lives, Services, Data, etc.
 * It's the orchestration layer of the page using the components
 */
export function SignUpPage() {
  const navigateTo = useNavigate();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleSubmit = async (payload: IAuth.ISignUpPayload) => {
    try {
      const sessionId = await authService.signUp(payload);
      persistantStorageService.setAppSessionId(sessionId);
      navigateTo(AppRoutes.Home);
    } catch (e) {
      setFormErrors(e as string[]);
    }
  };

  return (
    <div id="sign-up-page" className='flex justify-center'>
      <SignUpForm handleSubmit={handleSubmit} errors={formErrors} />
    </div>
  );
}
