# API Integration Documentation

## Base URL
```
https://justgo-api.up.railway.app
```

## Environment Configuration
The API base URL is configured using environment variables. Update `.env.local` for local development:
```
NEXT_PUBLIC_API_BASE_URL=https://justgo-api.up.railway.app
```

## Available API Methods

### Authentication

#### 1. Check Email
```typescript
api.checkEmail(email: string)
```
Checks if an email exists in the system.

#### 2. Sign In
```typescript
api.signIn({ email: string, password: string })
```
Authenticates a user and returns a token.

#### 3. Create Account
```typescript
api.createAccount({
  email: string,
  password?: string,
  fullName: string,
  professionalTitle: string
})
```
Creates a new user account.

#### 4. Submit Signup Code
```typescript
api.submitSignupCode({ code: string, email: string })
```
Verifies the email with a signup code.

#### 5. Add Photo
```typescript
api.addPhoto(file: File, { token?: string })
```
Uploads a profile photo (requires authentication).

#### 6. Update Profile
```typescript
api.updateProfile({ 
  officePhoneNumber: string, 
  status: string 
}, { token?: string })
```
Updates user profile information (requires authentication).

#### 7. Add Specialty
```typescript
api.addSpecialty({ specialty: string }, { token?: string })
```
Adds a specialty to the user profile (requires authentication).

#### 8. Get Profile
```typescript
api.getProfile({ token?: string })
```
Retrieves the authenticated user's profile.

#### 9. Recover Account
```typescript
api.recoverAccount({ email: string })
```
Initiates account recovery process.

#### 10. Submit Account Recovery Code
```typescript
api.submitAccountRecoveryCode({ code: string, email: string })
```
Verifies the recovery code.

#### 11. Reset Password
```typescript
api.resetPassword({ 
  password: string, 
  confirmPassword: string 
}, { token?: string })
```
Resets the user's password (requires recovery token).

### Curator (Admin)

#### 12. Curator Check Email
```typescript
api.curatorCheckEmail({ email: string, password: string })
```
Checks curator credentials.

#### 13. Curator Sign In
```typescript
api.curatorSignIn({ email: string, password: string })
```
Authenticates a curator/admin user.

#### 14. Get All Providers
```typescript
api.getProviders({ token?: string })
```
Retrieves list of all providers (requires curator authentication).

#### 15. Get Single Provider
```typescript
api.getProvider(email: string, { token?: string })
```
Retrieves details of a specific provider (requires curator authentication).

#### 16. Approve Provider
```typescript
api.approveProvider(email: string, { token?: string })
```
Approves a provider's registration (requires curator authentication).

#### 17. Reject Provider
```typescript
api.rejectProvider(email: string, { token?: string })
```
Rejects a provider's registration (requires curator authentication).

### Specialties

#### 18. Create Specialty
```typescript
api.createSpecialty({ name: string })
```
Creates a new specialty category.

#### 19. List Specialties
```typescript
api.listSpecialties()
```
Retrieves all available specialties.

## Usage Examples

### Basic Usage
```typescript
import { api } from '@/lib/api';

// Sign in
const response = await api.signIn({
  email: 'user@example.com',
  password: 'password123'
});
const token = response.token;

// Get profile with token
const profile = await api.getProfile({ token });
```

### With React Query
```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Mutation example
const { mutate, isPending } = useMutation({
  mutationFn: api.signIn,
  onSuccess: (data) => {
    console.log('Login successful', data);
  },
  onError: (error) => {
    console.error('Login failed', error);
  }
});

// Query example
const { data, isLoading } = useQuery({
  queryKey: ['specialties'],
  queryFn: api.listSpecialties
});
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "message": "Error description"
}
```

Use the `checkError` utility to handle errors consistently:
```typescript
import { checkError } from '@/configs/axiosInstance';

try {
  await api.signIn(credentials);
} catch (error) {
  const message = checkError(error);
  console.error(message);
}
```

## Authentication

Most endpoints require a Bearer token in the Authorization header. After successful login:
1. Store the token securely (e.g., localStorage, secure cookie)
2. Pass the token to authenticated endpoints: `{ token: 'your-token' }`

Example:
```typescript
const token = localStorage.getItem('authToken');
await api.getProfile({ token });
```
