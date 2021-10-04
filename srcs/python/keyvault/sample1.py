import os
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

keyVaultName = os.environ['KEY_VAULT_NAME']

print('hello', keyVaultName)
