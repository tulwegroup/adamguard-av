'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  CheckCircle,
  Zap,
  Shield,
  Brain,
  Heart,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { PRICING_PLANS, formatPrice, TRIAL_CONFIG, type LicenseTier, getTierDisplayName } from '@/lib/license';

interface LicenseBannerProps {
  tier: LicenseTier;
  daysRemaining?: number;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export function LicenseBanner({ tier, daysRemaining = 0, onDismiss }: LicenseBannerProps) {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'family' | 'business'>('family');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Only show for trial users
  if (tier !== 'trial') return null;

  const isExpiringSoon = daysRemaining <= 3;
  const isExpired = daysRemaining <= 0;
  const progressPercent = Math.round((daysRemaining / TRIAL_CONFIG.durationDays) * 100);

  if (isExpired) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Trial Expired</h3>
                <p className="text-sm text-gray-300">
                  Your trial has ended. Upgrade to continue using all features.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsUpgradeOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </motion.div>

        <UpgradeDialog
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 ${
          isExpiringSoon
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30'
            : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isExpiringSoon ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
              <Clock className={`w-5 h-5 ${isExpiringSoon ? 'text-amber-400' : 'text-blue-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">
                  {isExpiringSoon ? 'Trial Expiring Soon!' : 'Free Trial'}
                </h3>
                <Badge variant="outline" className={`text-xs ${
                  isExpiringSoon ? 'border-amber-500/30 text-amber-400' : 'border-blue-500/30 text-blue-400'
                }`}>
                  {daysRemaining} days left
                </Badge>
              </div>
              <p className="text-sm text-gray-300">
                {isExpiringSoon
                  ? 'Upgrade now to keep your protection active.'
                  : 'Upgrade to unlock AI protection, parental controls, and more.'}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={progressPercent} className="w-32 h-1.5" />
                <span className="text-xs text-gray-400">{progressPercent}% remaining</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss} className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setIsUpgradeOpen(true)}
              className={`${
                isExpiringSoon
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div>
      </motion.div>

      <UpgradeDialog
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
      />
    </>
  );
}

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'family' | 'business';
  setSelectedPlan: (plan: 'family' | 'business') => void;
  billingCycle: 'monthly' | 'yearly';
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
}

function UpgradeDialog({ isOpen, onClose, selectedPlan, setSelectedPlan, billingCycle, setBillingCycle }: UpgradeDialogProps) {
  const plans = [
    { 
      id: 'family' as const, 
      name: 'Family', 
      monthlyPrice: 6.99, 
      yearlyPrice: 69.99,
      icon: Heart,
      color: 'rose',
      features: ['5 devices', 'AI protection', 'Parental controls', 'Priority email support']
    },
    { 
      id: 'business' as const, 
      name: 'Business', 
      monthlyPrice: 14.99, 
      yearlyPrice: 149.99,
      icon: Building2,
      color: 'blue',
      features: ['25 devices', 'Team management', 'VPN included', 'Phone support']
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose the perfect protection plan for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-2 p-1 bg-gray-800/50 rounded-lg w-fit mx-auto">
            {(['monthly', 'yearly'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingCycle === cycle
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                {cycle === 'yearly' && (
                  <Badge className="ml-2 bg-amber-500/20 text-amber-300 text-xs">
                    Save ~17%
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedPlan === plan.id
                    ? plan.color === 'rose'
                      ? 'bg-rose-500/10 border-rose-500/50'
                      : 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <plan.icon className={`w-5 h-5 ${plan.color === 'rose' ? 'text-rose-400' : 'text-blue-400'}`} />
                  <span className="font-medium text-white">{plan.name}</span>
                  {plan.id === 'family' && (
                    <Badge className="text-xs bg-rose-500/20 text-rose-300">Popular</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(getPrice(plan))}
                  <span className="text-sm font-normal text-gray-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </p>
                <div className="mt-3 space-y-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Features Overview */}
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <p className="text-sm font-medium text-gray-300 mb-3">All plans include:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Brain, label: 'AI Threat Detection', desc: 'Smart analysis' },
                { icon: Shield, label: 'Zero-Day Protection', desc: 'Proactive defense' },
                { icon: Zap, label: 'Real-time Scanning', desc: '24/7 monitoring' },
                { icon: Crown, label: 'Priority Support', desc: 'Fast response' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                  <feature.icon className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-medium text-white">{feature.label}</p>
                    <p className="text-xs text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-600">
            Maybe Later
          </Button>
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} - {formatPrice(getPrice(plans.find(p => p.id === selectedPlan)!))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Pro Status Badge for header
export function ProStatusBadge({ tier }: { tier: LicenseTier }) {
  const getBadgeConfig = () => {
    switch (tier) {
      case 'trial':
        return { 
          className: 'border-blue-500/30 text-blue-400 bg-blue-500/10', 
          icon: Clock, 
          label: 'Free Trial' 
        };
      case 'essential':
        return { 
          className: 'border-gray-500/30 text-gray-400 bg-gray-500/10', 
          icon: Shield, 
          label: 'Essential' 
        };
      case 'family':
        return { 
          className: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white', 
          icon: Heart, 
          label: 'Family' 
        };
      case 'business':
        return { 
          className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', 
          icon: Building2, 
          label: 'Business' 
        };
      case 'enterprise':
        return { 
          className: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white', 
          icon: Crown, 
          label: 'Enterprise' 
        };
      default:
        return { 
          className: 'border-gray-500/30 text-gray-400', 
          icon: Shield, 
          label: tier 
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
