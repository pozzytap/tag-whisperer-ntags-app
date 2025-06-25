
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wifi, Shield, Settings, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import TagDetection from '@/components/TagDetection';
import TagConfiguration from '@/components/TagConfiguration';
import SecuritySettings from '@/components/SecuritySettings';
import URLMirror from '@/components/URLMirror';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tagInfo, setTagInfo] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(false);

  useEffect(() => {
    // Check if NFC is supported
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const getStatusIcon = () => {
    if (!nfcSupported) return <XCircle className="h-5 w-5" />;
    if (isConnected) return <CheckCircle className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getStatusColor = () => {
    if (!nfcSupported) return 'destructive';
    if (isConnected) return 'default';
    return 'secondary';
  };

  const getStatusText = () => {
    if (!nfcSupported) return 'NFC Not Supported';
    if (isConnected) return 'NTAG424 Connected';
    return 'Ready to Scan';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">NFC Tag Programmer</h1>
          </div>
          <p className="text-blue-200 text-lg">Configure and program NXP NTAG424 NFC tags</p>
        </div>

        {/* Status Bar */}
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  {getStatusIcon()}
                </div>
                <div>
                  <Badge variant={getStatusColor()} className="mb-1">
                    {getStatusText()}
                  </Badge>
                  {tagInfo && (
                    <p className="text-sm text-slate-400">
                      UID: {tagInfo.uid} | Memory: {tagInfo.memory}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-sm text-slate-400">System Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {!nfcSupported && (
          <Alert className="mb-6 bg-red-900 border-red-700">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              NFC is not supported in this browser. Please use a compatible mobile browser or enable NFC in your browser settings.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Interface */}
        <Tabs defaultValue="detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="detection" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="mirror" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              URL Mirror
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            <TagDetection 
              onTagDetected={setTagInfo}
              onConnectionChange={setIsConnected}
              nfcSupported={nfcSupported}
            />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <TagConfiguration 
              tagInfo={tagInfo}
              isConnected={isConnected}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings 
              tagInfo={tagInfo}
              isConnected={isConnected}
            />
          </TabsContent>

          <TabsContent value="mirror" className="space-y-6">
            <URLMirror 
              tagInfo={tagInfo}
              isConnected={isConnected}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400">
          <p className="text-sm">
            Built for NXP NTAG424 DNA • Secure NFC Programming Interface
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
