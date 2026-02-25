'use client';

import { motion } from 'framer-motion';
import { Bot, Activity, Shield, Zap, Brain, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAntivirusStore } from '@/lib/store';

export function AIAgentPanel() {
  const { aiAgents, runAIAnalysis, aiProtectionEnabled, toggleAIProtection, stats } = useAntivirusStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'processing': return 'text-yellow-400 bg-yellow-400/10';
      case 'idle': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'idle': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Protection Overview */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">AI Protection Engine</CardTitle>
                <p className="text-sm text-gray-400">Neural network-powered threat detection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={aiProtectionEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {aiProtectionEnabled ? 'Active' : 'Disabled'}
              </Badge>
              <Button
                onClick={toggleAIProtection}
                variant={aiProtectionEnabled ? 'destructive' : 'default'}
                size="sm"
              >
                {aiProtectionEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* AI Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Threats Analyzed</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.aiStats.threatsAnalyzed.toLocaleString()}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Zero-Day Blocked</span>
              </div>
              <p className="text-2xl font-bold text-red-400">{stats.aiStats.zeroDayBlocked}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.aiStats.accuracy}%</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Active Agents</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{stats.aiStats.activeAgents}</p>
            </motion.div>
          </div>

          {/* Run Analysis Button */}
          <Button
            onClick={runAIAnalysis}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Run Deep AI Analysis
          </Button>
        </CardContent>
      </Card>

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(agent.status)}
                          {agent.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Accuracy</p>
                    <p className="text-lg font-bold text-green-400">{agent.accuracy}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Current Task</span>
                      <span className="text-white">{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{agent.task}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>{agent.threatCount} threats blocked</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Capabilities */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <h4 className="font-medium text-white mb-2">Zero-Day Detection</h4>
              <p className="text-sm text-gray-400">
                Machine learning models identify novel malware variants before signatures exist, 
                providing protection against emerging threats.
              </p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <h4 className="font-medium text-white mb-2">Behavioral Analysis</h4>
              <p className="text-sm text-gray-400">
                Real-time monitoring of process behavior to detect suspicious activities 
                like ransomware encryption or keylogger behavior.
              </p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <h4 className="font-medium text-white mb-2">Predictive Protection</h4>
              <p className="text-sm text-gray-400">
                AI predicts and blocks attack patterns based on threat intelligence 
                and historical attack vectors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
