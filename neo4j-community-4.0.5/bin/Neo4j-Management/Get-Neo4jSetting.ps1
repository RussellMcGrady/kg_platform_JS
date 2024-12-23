# Copyright (c) 2002-2020 "Neo4j,"
# Neo4j Sweden AB [http://neo4j.com]
#
# This file is part of Neo4j.
#
# Neo4j is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.



<#
.SYNOPSIS
TODO UPDATE HELPTEXT
Retrieves properties about a Neo4j installation

.DESCRIPTION
Retrieves properties about a Neo4j installation

.PARAMETER Neo4jServer
An object representing a valid Neo4j Server object

.PARAMETER ConfigurationFile
The name of the configuration file or files to parse.  If not specified the default set of all configuration files are used.  Do not use the full path, just the filename, the path is relative to '[Neo4jHome]\conf'

.PARAMETER Name
The name of the property to retrieve.  If not specified, all properties are returned.

.EXAMPLE
Get-Neo4jSetting -Neo4jServer $ServerObject | Format-Table

Retrieves all settings for the Neo4j installation at $ServerObject

.EXAMPLE
Get-Neo4jSetting -Neo4jServer $ServerObject -Name 'dbms.default_database'

Retrieves all settings with the name 'dbms.default_database' from the Neo4j installation at $ServerObject

.EXAMPLE
Get-Neo4jSetting -Neo4jServer $ServerObject -Name 'dbms.default_database' -ConfigurationFile 'neo4j.conf'

Retrieves all settings with the name 'dbms.default_database' from the Neo4j installation at $ServerObject in 'neo4j.conf'

.OUTPUTS
System.Management.Automation.PSCustomObject
This is a Neo4j Setting Object
Properties;
'Name' : Name of the property
'Value' : Value of the property.  Multivalue properties are string arrays (string[])
'ConfigurationFile' : Name of the configuration file where the setting is defined
'IsDefault' : Whether this setting is a default value (Reserved for future use)
'Neo4jHome' : Path to the Neo4j installation

.LINK
Get-Neo4jServer 

.NOTES
This function is private to the powershell module

#>
function Get-Neo4jSetting
{
  [CmdletBinding(SupportsShouldProcess = $false,ConfirmImpact = 'Low')]
  param(
    [Parameter(Mandatory = $true,ValueFromPipeline = $true)]
    [pscustomobject]$Neo4jServer

    ,[Parameter(Mandatory = $false)]
    [string[]]$ConfigurationFile = $null

    ,[Parameter(Mandatory = $false)]
    [string]$Name = ''
  )

  begin
  {
  }

  process
  {
    # Get the Neo4j Server information
    if ($Neo4jServer -eq $null) { return }

    # Set the default list of configuration files    
    if ($ConfigurationFile -eq $null)
    {
      $ConfigurationFile = ('neo4j.conf','neo4j-wrapper.conf')
    }

    $ConfigurationFile | ForEach-Object -Process `
       {
      $filename = $_
      $filePath = Join-Path -Path $Neo4jServer.ConfDir -ChildPath $filename
      if (Test-Path -Path $filePath)
      {
        $keyPairsFromFile = Get-KeyValuePairsFromConfFile -FileName $filePath
      }
      else
      {
        $keyPairsFromFile = $null
      }

      if ($keyPairsFromFile -ne $null)
      {
        $keyPairsFromFile.GetEnumerator() | Where-Object { ($Name -eq '') -or ($_.Name -eq $Name) } | ForEach-Object -Process `
           {
          $properties = @{
            'Name' = $_.Name;
            'Value' = $_.value;
            'ConfigurationFile' = $filename;
            'IsDefault' = $false;
            'Neo4jHome' = $Neo4jServer.Home;
          }

          Write-Output (New-Object -TypeName PSCustomObject -Property $properties)
        }
      }
    }
  }

  end
  {
  }
}

# SIG # Begin signature block
# MIIQ4QYJKoZIhvcNAQcCoIIQ0jCCEM4CAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBEISGr+igT3Y0o
# N7MNS/J3kSs33j+YYe5vMUCQZcd+R6CCDcIwggPFMIICraADAgECAgEAMA0GCSqG
# SIb3DQEBCwUAMIGDMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJpem9uYTETMBEG
# A1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20sIEluYy4xMTAv
# BgNVBAMTKEdvIERhZGR5IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IC0gRzIw
# HhcNMDkwOTAxMDAwMDAwWhcNMzcxMjMxMjM1OTU5WjCBgzELMAkGA1UEBhMCVVMx
# EDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxGjAYBgNVBAoT
# EUdvRGFkZHkuY29tLCBJbmMuMTEwLwYDVQQDEyhHbyBEYWRkeSBSb290IENlcnRp
# ZmljYXRlIEF1dGhvcml0eSAtIEcyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
# CgKCAQEAv3FiCPH6WTT3G8kYo/eASVjpIoMTpsUgQwE7hPHmhUmfJ+r2hBtOoLTb
# cJjHMgGxBT4HTu70+k8vWTAi56sZVmvigAf88xZ1gDlRe+X5NbZ0TqmNghPktj+p
# A4P6or6KFWp/3gvDthkUBcrqw6gElDtGfDIN8wBmIsiNaW02jBEYt9OyHGC0OPoC
# jM7T3UYH3go+6118yHz7sCtTpJJiaVElBWEaRIGMLKlDliPfrDqBmg4pxRyp6V0e
# tp6eMAo5zvGIgPtLXcwy7IViQyU0AlYnAZG0O3AqP26x6JyIAX2f1PnbU21gnb8s
# 51iruF9G/M7EGwM8CetJMVxpRrPgRwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/
# MA4GA1UdDwEB/wQEAwIBBjAdBgNVHQ4EFgQUOpqFBxBnKLbv9r0FQW4gwZTaD94w
# DQYJKoZIhvcNAQELBQADggEBAJnbXXnV+ZdZZwNh8X47BjF1LaEgjk9lh7T3ppy8
# 2Okv0Nta7s90jHO0OELaBXv4AnW4/aWx1672194Ty1MQfopG0Zf6ty4rEauQsCeA
# +eifWuk3n6vk32yzhRedPdkkT3mRNdZfBOuAg6uaAi21EPTYkMcEc0DtciWgqZ/s
# nqtoEplXxo8SOgmkvUT9BhU3wZvkMqPtOOjYZPMsfhT8Auqfzf8HaBfbIpA4LXqN
# 0VTxaeNfM8p6PXsK48p/Xznl4nW6xXYYM84s8C9Mrfex585PqMSbSlQGxX991QgP
# 4hz+fhe4rF721BayQwkMTfana7SZhGXKeoji4kS+XPfqHPUwggTQMIIDuKADAgEC
# AgEHMA0GCSqGSIb3DQEBCwUAMIGDMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJp
# em9uYTETMBEGA1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20s
# IEluYy4xMTAvBgNVBAMTKEdvIERhZGR5IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
# aXR5IC0gRzIwHhcNMTEwNTAzMDcwMDAwWhcNMzEwNTAzMDcwMDAwWjCBtDELMAkG
# A1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUx
# GjAYBgNVBAoTEUdvRGFkZHkuY29tLCBJbmMuMS0wKwYDVQQLEyRodHRwOi8vY2Vy
# dHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8xMzAxBgNVBAMTKkdvIERhZGR5IFNl
# Y3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBHMjCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBALngyxDUr3a91JNi6zBkuIEIbMME2WIXji//PmXPj85i
# 5jxSHNoWRUtVq3hrY4NikM4PaWyZyBoUi0zMRTPqiNyeo68r/oBhnXlXxM8u9D8w
# PF1H/JoWvMM3lkFRjhFLVPgovtCMvvAwOB7zsCb4Zkdjbd5xJkePOEdT0UYdtOPc
# AOpFrL28cdmqbwDb280wOnlPX0xH+B3vW8LEnWA7sbJDkdikM07qs9YnT60liqXG
# 9NXQpq50BWRXiLVEVdQtKjo++Li96TIKApRkxBY6UPFKrud5M68MIAd/6N8EOcJp
# AmxjUvp3wRvIdIfIuZMYUFQ1S2lOvDvTSS4f3MHSUvsCAwEAAaOCARowggEWMA8G
# A1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMB0GA1UdDgQWBBRAwr0njsw0
# gzCiM9f7bLPwtCyAzjAfBgNVHSMEGDAWgBQ6moUHEGcotu/2vQVBbiDBlNoP3jA0
# BggrBgEFBQcBAQQoMCYwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmdvZGFkZHku
# Y29tLzA1BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLmdvZGFkZHkuY29tL2dk
# cm9vdC1nMi5jcmwwRgYDVR0gBD8wPTA7BgRVHSAAMDMwMQYIKwYBBQUHAgEWJWh0
# dHBzOi8vY2VydHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQEL
# BQADggEBAAh+bJMQyDi4lqmQS/+hX08E72w+nIgGyVCPpnP3VzEbvrzkL9v4utNb
# 4LTn5nliDgyi12pjczG19ahIpDsILaJdkNe0fCVPEVYwxLZEnXssneVe5u8MYaq/
# 5Cob7oSeuIN9wUPORKcTcA2RH/TIE62DYNnYcqhzJB61rCIOyheJYlhEG6uJJQEA
# D83EG2LbUbTTD1Eqm/S8c/x2zjakzdnYLOqum/UqspDRTXUYij+KQZAjfVtL/qQD
# WJtGssNgYIP4fVBBzsKhkMO77wIv0hVU7kQV2Qqup4oz7bEtdjYm3ATrn/dhHxXc
# h2/uRpYoraEmfQoJpy4Eo428+LwEMAEwggUhMIIECaADAgECAgkAhHYYKGL3whow
# DQYJKoZIhvcNAQELBQAwgbQxCzAJBgNVBAYTAlVTMRAwDgYDVQQIEwdBcml6b25h
# MRMwEQYDVQQHEwpTY290dHNkYWxlMRowGAYDVQQKExFHb0RhZGR5LmNvbSwgSW5j
# LjEtMCsGA1UECxMkaHR0cDovL2NlcnRzLmdvZGFkZHkuY29tL3JlcG9zaXRvcnkv
# MTMwMQYDVQQDEypHbyBEYWRkeSBTZWN1cmUgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
# IC0gRzIwHhcNMTcxMTA3MTkzNzAzWhcNMjAxMTA3MTkzNzAzWjBiMQswCQYDVQQG
# EwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTESMBAGA1UEBxMJU2FuIE1hdGVvMRQw
# EgYDVQQKEwtOZW80aiwgSW5jLjEUMBIGA1UEAxMLTmVvNGosIEluYy4wggEiMA0G
# CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDSoPiG1pU1Lvqo+aZsFTrUwaV1sDWV
# BtfWzSnDKB3bUJeC7DhekXtt1FORi3PB4YAC/CSMGgwoBHuqgGuRaJbHjRlmYaZZ
# dKVsgvmDwfEvv16jzoyUR8TMTTjCemIDAHwArEadkffpsgnFpQ6KG6+gag/39FXy
# M2rGmFaqSGkqjVRNu4zN5GQu8+CUvRuZO2zEuKdA4wv9ZlmWbV3bpCGIN3Zl4p39
# Fatz3KYNi4g8lFXhB8tJfBToRuqxLZpcuyrXG3PeLa6DNoYOJ3j49DJOEw8Wj9cn
# qvAaI3CNE2klZ7RScE47YUh7rVpl/ykp9ohgZDtvhAA5RYI5KCnc+oXHAgMBAAGj
# ggGFMIIBgTAMBgNVHRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA4GA1Ud
# DwEB/wQEAwIHgDA1BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLmdvZGFkZHku
# Y29tL2dkaWcyczUtMy5jcmwwXQYDVR0gBFYwVDBIBgtghkgBhv1tAQcXAjA5MDcG
# CCsGAQUFBwIBFitodHRwOi8vY2VydGlmaWNhdGVzLmdvZGFkZHkuY29tL3JlcG9z
# aXRvcnkvMAgGBmeBDAEEATB2BggrBgEFBQcBAQRqMGgwJAYIKwYBBQUHMAGGGGh0
# dHA6Ly9vY3NwLmdvZGFkZHkuY29tLzBABggrBgEFBQcwAoY0aHR0cDovL2NlcnRp
# ZmljYXRlcy5nb2RhZGR5LmNvbS9yZXBvc2l0b3J5L2dkaWcyLmNydDAfBgNVHSME
# GDAWgBRAwr0njsw0gzCiM9f7bLPwtCyAzjAdBgNVHQ4EFgQUvj4gytCNJMDPx3lW
# v0klX6YK41IwDQYJKoZIhvcNAQELBQADggEBABzaEnMJczETlZUdZE36x84eQS2A
# mumczZzTMbZ4IhJwxF8vVz2+Q+0BcR5uwAXa+s167yqIZsxAub3nu8GzYAF7D7wH
# DC1H1JNkgfnZf1w2WWGL6jkbr5RGrLlU2xE8o03iuFglU4QQl9ouXXBLAsLo/q+p
# MrPs+EO+g3DwXGFtjAKzkrMzJD5Ia2kVSC2aAXrffwRqMpbKVxkf0TQadMGLa6dV
# ybYH7qBfDZ+u8P2KY0qQyQYY63WoVk7TIq1VkbmRXtcvm3/plWPUNTPPEy0Dfnjn
# dA2UByib6/iqdnSZ7MYit31rmSsRAS3Wil/qqOGlVfYrSm2s64ryPMOacAkxggJ1
# MIICcQIBATCBwjCBtDELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzAR
# BgNVBAcTClNjb3R0c2RhbGUxGjAYBgNVBAoTEUdvRGFkZHkuY29tLCBJbmMuMS0w
# KwYDVQQLEyRodHRwOi8vY2VydHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8xMzAx
# BgNVBAMTKkdvIERhZGR5IFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBH
# MgIJAIR2GChi98IaMA0GCWCGSAFlAwQCAQUAoIGEMBgGCisGAQQBgjcCAQwxCjAI
# oAKAAKECgAAwGQYJKoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIB
# CzEOMAwGCisGAQQBgjcCARUwLwYJKoZIhvcNAQkEMSIEIDeM8L4s7rGBJam2ckyF
# 08db8xGWWyLCGZCNhRaC6tCxMA0GCSqGSIb3DQEBAQUABIIBAB1mJzOXlQZD6134
# QPplWkQnKJi3bSIW0bGMVJ9TQCA+Np+mzrQ8EaZtiFVMTAZsft+y0WCUV505levc
# l2iawFTAwmV6K5y0+lWTmN2tYpPwMnaBRA4Ype9cTlGAQZN2o9KPQBiXjhsdWrpf
# PtQ91ZnnRgRlzL0PYhB1BKsg2hHa5K5dHj8X4pIaC2CoPRMLBxnupibUy/jkTnp+
# UqBnpww2wqu0i3cSGu+QqRbRd89hMhVOqWxPzh6KW0ww5Ti+0VudNi7trJ7GqlJr
# dx6+cSPZLfOT9PiQ7P/vMpe7E+UPJedr/j3rIZhYnfSJ+17jrBWEl+/QGsFMm/F9
# mfSILhM=
# SIG # End signature block
