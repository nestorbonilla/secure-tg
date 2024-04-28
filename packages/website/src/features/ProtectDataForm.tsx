import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Connector, useAccount } from 'wagmi';
import { IExecDataProtector, type DataSchema } from '@iexec/dataprotector';
import { IEXEC_EXPLORER_URL } from '../utils/config.ts';
import { Address } from '../utils/types.ts';

export default function ProtectDataForm({
  protectedData,
  setProtectedData,
}: {
  protectedData: Address | '';
  setProtectedData: (protectedData: Address) => void;
}) {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');
  const username = queryParams.get('username');

  // ProtectDataForm only displayed if user is logged in
  const { connector } = useAccount() as { connector: Connector };

  //loading effect & error
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [errorProtect, setErrorProtect] = useState('');

  //set name
  const [name, setName] = useState('TG Secure Data');

  //set telegram data
  const [telegramId, setTelegramId] = useState(id ?? "");
  const [telegramUsername, setTelegramUsername] = useState(username ?? "");

  //handle functions
  const handleTelegramIdChange = (event: any) => {
    setTelegramId(event.target.value);
  };

  const handleTelegramUsernameChange = (event: any) => {
    setTelegramUsername(event.target.value);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  //handle Submit
  const protectedDataSubmit = async () => {
    setErrorProtect('');

    if (!telegramId || !telegramUsername) {
      setErrorProtect('Please enter a valid telegram id and username');
      return;
    }

    const data: DataSchema = { id: telegramId, username: telegramUsername } as DataSchema;
    try {
      setLoadingProtect(true);

      const provider = await connector.getProvider();
      const dataProtector = new IExecDataProtector(provider);
      const { address: protectedDataAddress } = await dataProtector.protectData(
        {
          data,
          name,
        }
      );
      setProtectedData(protectedDataAddress as Address);
      setErrorProtect('');
    } catch (error) {
      setErrorProtect(String(error));
    }
    setLoadingProtect(false);
  };

  return (
    <Box className="form-box">
      <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
        Protect your telegram account
      </Typography>
      <TextField
        type="number"
        fullWidth
        required
        label="Telegram Id"
        variant="outlined"
        value={telegramId}
        sx={{ mt: 3 }}
        onChange={handleTelegramIdChange}
      />
      <TextField
        type="text"
        fullWidth
        required
        label="Telegram Username"
        variant="outlined"
        value={telegramUsername}
        sx={{ mt: 3 }}
        onChange={handleTelegramUsernameChange}
      />
      <TextField
        type="text"
        fullWidth
        label="Name"
        variant="outlined"
        value={name}
        sx={{ mt: 3 }}
        onChange={handleNameChange}
      />
      {errorProtect && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="error">
          <Typography variant="h6">Creation failed</Typography>
          {errorProtect}
        </Alert>
      )}
      {!loadingProtect && (
        <Button
          sx={{ display: 'block', margin: '20px auto' }}
          onClick={protectedDataSubmit}
          variant="contained"
        >
          Create
        </Button>
      )}
      {protectedData && !errorProtect && (
        <Alert sx={{ mt: 3, mb: 2 }} severity="success">
          <Typography variant="h6">Your data has been protected!</Typography>
          <Link
            href={IEXEC_EXPLORER_URL + protectedData}
            target="_blank"
            sx={{ color: 'green', textDecorationColor: 'green' }}
          >
            You can check it here
          </Link>
          <p>
            Your protected data address:{' '}
            <span style={{ fontSize: '0.75rem', letterSpacing: '-0.025em' }}>
              {protectedData}
            </span>
          </p>
        </Alert>
      )}
      {loadingProtect && (
        <CircularProgress
          sx={{ display: 'block', margin: '20px auto' }}
        ></CircularProgress>
      )}
    </Box>
  );
}
