'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAntivirusStore } from '@/lib/store';

export function ProtectionStatus() {
  const { protectionEnabled, toggleProtection } = useAntivirusStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center justify-center p-8"
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {protectionEnabled && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-48 h-48 rounded-full border-2 border-green-500/20"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-56 h-56 rounded-full border border-green-500/10"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.02, 0.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute w-64 h-64 rounded-full border border-green-500/5"
            />
          </>
        )}
      </div>

      {/* Main shield icon */}
      <motion.div
        animate={protectionEnabled ? { 
          filter: ['drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))', 
                   'drop-shadow(0 0 40px rgba(34, 197, 94, 0.8))',
                   'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))']
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {protectionEnabled ? (
            <motion.div
              key="protected"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <ShieldCheck className="w-32 h-32 text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              key="unprotected"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <ShieldX className="w-32 h-32 text-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status text */}
      <motion.h2 
        className={`text-2xl font-bold mt-6 ${protectionEnabled ? 'text-green-400' : 'text-red-400'}`}
        key={protectionEnabled ? 'enabled' : 'disabled'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {protectionEnabled ? 'Protected' : 'Protection Disabled'}
      </motion.h2>
      
      <p className="text-gray-400 mt-2 text-center">
        {protectionEnabled 
          ? 'Your system is actively protected against threats'
          : 'Enable protection to secure your system'}
      </p>

      {/* Toggle button */}
      <Button
        onClick={toggleProtection}
        className={`mt-6 px-8 py-6 text-lg font-semibold ${
          protectionEnabled
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {protectionEnabled ? 'Disable Protection' : 'Enable Protection'}
      </Button>

      {/* Additional info when protected */}
      {protectionEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-green-400 font-semibold">Real-time</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-green-400 font-semibold">Firewall</p>
            <p className="text-xs text-gray-400">Enabled</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-green-400 font-semibold">Network</p>
            <p className="text-xs text-gray-400">Monitored</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
