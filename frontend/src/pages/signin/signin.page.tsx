import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignInForm } from 'src/components'
import { IAuth } from 'src/defs'
import { authService } from 'src/services'
import { constants } from 'src/utils'
import { persistantStorageService } from 'src/services'

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const handleSubmit = async (payload: IAuth.ISignInPayload) => {
    try {
      const sessionId = await authService.signIn(payload);
      persistantStorageService.setAppSessionId(sessionId);
      navigateTo(AppRoutes.Home);
    } catch (e) {
      setFormErrors(e as string[]);
    }
  }

  return (
    <div id="sign-in-page" className='flex justify-center'>
      <SignInForm handleSubmit={handleSubmit} errors={formErrors} />
    </div>
  );
}
