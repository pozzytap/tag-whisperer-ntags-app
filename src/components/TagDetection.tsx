
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wifi, Scan, Info, Zap, Radio } from 'lucide-react';

interface TagDetectionProps {
  onTagDetected: (tagInfo: any) => void;
  onConnectionChange: (connected: boolean) => void;
  nfcSupported: boolean;
}

const TagDetection: React.FC<TagDetectionProps> = ({ 
  onTagDetected, 
  onConnectionChange, 
  nfcSupported 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  const startScan = async () => {
    if (!nfcSupported) {
      setError('NFC is not supported in this browser');
      return;
    }

    setIsScanning(true);
    setError('');
    
    try {
      // Simulate NFC scanning process
      setTimeout(() => {
        const mockTagInfo = {
          uid: 'E2:80:69:02:01:23:45:67',
          type: 'NTAG424 DNA',
          memory: '416 bytes',
          version: '4.2.1',
          locked: false,
          encrypted: true,
          tamperDetected: false
        };
        
        setScanResult(mockTagInfo);
        onTagDetected(mockTagInfo);
        onConnectionChange(true);
        setIsScanning(false);
      }, 2000);
    } catch (err) {
      setError('Failed to scan NFC tag. Please try again.');
      setIsScanning(false);
    }
  };

  const disconnectTag = () => {
    setScanResult(null);
    onTagDetected(null);
    onConnectionChange(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Radio className="h-5 w-5 text-blue-400" />
            NFC Tag Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!scanResult ? (
            <div className="text-center space-y-4">
              <div className="p-8 border-2 border-dashed border-slate-600 rounded-lg">
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-full ${isScanning ? 'bg-blue-600 animate-pulse' : 'bg-slate-700'}`}>
                    <Scan className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {isScanning ? 'Scanning for NFC tags...' : 'Ready to scan'}
                    </h3>
                    <p className="text-slate-400">
                      {isScanning 
                        ? 'Please bring your NTAG424 tag close to the device'
                        : 'Click the button below to start scanning for NFC tags'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={startScan}
                disabled={isScanning || !nfcSupported}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Start NFC Scan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-600 hover:bg-green-700">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <Button 
                  onClick={disconnectTag}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Disconnect
                </Button>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-400" />
                  Tag Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">UID:</span>
                    <p className="text-white font-mono">{scanResult.uid}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Type:</span>
                    <p className="text-white">{scanResult.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Memory:</span>
                    <p className="text-white">{scanResult.memory}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Version:</span>
                    <p className="text-white">{scanResult.version}</p>
                  </div>
                </div>
                
                <Separator className="my-3 bg-slate-700" />
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={scanResult.locked ? 'destructive' : 'default'}>
                    {scanResult.locked ? 'Locked' : 'Unlocked'}
                  </Badge>
                  <Badge variant={scanResult.encrypted ? 'default' : 'secondary'}>
                    {scanResult.encrypted ? 'Encrypted' : 'Plain'}
                  </Badge>
                  <Badge variant={scanResult.tamperDetected ? 'destructive' : 'default'}>
                    {scanResult.tamperDetected ? 'Tamper Detected' : 'Tamper Safe'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert className="bg-red-900 border-red-700">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">NFC Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${nfcSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-slate-300">NFC API Support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span className="text-slate-300">HTTPS Connection Required</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span className="text-slate-300">Modern Browser (Chrome, Firefox, Safari)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagDetection;
