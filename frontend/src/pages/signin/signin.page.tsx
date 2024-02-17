import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignInForm } from 'src/components'
import { IAuth } from 'src/defs'
import { authService } from 'src/services'
import { constants } from 'src/utils'

const { AppRoutes } = constants

/**
 * @notice - Separation of Concerns
 * Its important to seperate the page logic from the component
 * Pages acts as controllers and components acts as views
 * This is where the logic of the page lives, Services, Data, etc.
 * It's the orchestration layer of the page using the components
 */
export function SignInPage() {
  const navigateTo = useNavigate();
  const [signInFormErrors, setSignUpFormErrors] = useState<string[]>([]);
  const handleSubmit = async (payload: IAuth.ISignInPayload) => {
    try {
      await authService.signIn(payload);
    } catch (e) {
      setSignUpFormErrors(["something went wrong"]);
    }
    navigateTo(AppRoutes.Home);
  }

  return (
    <div id="sign-in-page">
      <SignInForm handleSubmit={handleSubmit} errors={signInFormErrors} />
    </div>
  );
}
