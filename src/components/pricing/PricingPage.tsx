'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Crown,
  Star,
  Globe,
  MapPin,
  Shield,
  Heart,
  Building2,
  Users,
  Sparkles,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  PRICING_TIERS,
  type Region,
  type SubscriptionTier,
  REGIONAL_PRICING,
  VOLUME_DISCOUNTS,
} from '@/lib/regionalPricing';

export function PricingPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('north_america');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [enterpriseSeats, setEnterpriseSeats] = useState(50);

  const currentPricing = REGIONAL_PRICING[selectedRegion];

  const regions = [
    { id: 'north_america', name: 'North America', flag: '🇺🇸' },
    { id: 'western_europe', name: 'Western Europe', flag: '🇪🇺' },
    { id: 'eastern_europe', name: 'Eastern Europe', flag: '🇵🇱' },
    { id: 'india', name: 'India', flag: '🇮🇳' },
    { id: 'southeast_asia', name: 'Southeast Asia', flag: '🇸🇬' },
    { id: 'latin_america', name: 'Latin America', flag: '🇧🇷' },
    { id: 'middle_east', name: 'Middle East', flag: '🇦🇪' },
    { id: 'africa', name: 'Africa', flag: '🇿🇦' },
    { id: 'east_asia', name: 'East Asia', flag: '🇯🇵' },
    { id: 'oceania', name: 'Oceania', flag: '🇦🇺' },
  ];

  const getTierPrice = (tier: SubscriptionTier): { price: string; originalPrice?: string; savings?: number } => {
    if (!currentPricing) return { price: 'Free' };

    switch (tier) {
      case 'essential':
        return { price: 'Free' };
      case 'family':
        if (billingCycle === 'monthly') {
          return { price: currentPricing.localizedPriceString(currentPricing.familyMonthly) };
        }
        const familySavings = Math.round((1 - currentPricing.familyYearly / (currentPricing.familyMonthly * 12)) * 100);
        return { 
          price: currentPricing.localizedPriceString(currentPricing.familyYearly),
          originalPrice: currentPricing.localizedPriceString(currentPricing.familyMonthly * 12),
          savings: familySavings
        };
      case 'business':
        if (billingCycle === 'monthly') {
          return { price: currentPricing.localizedPriceString(currentPricing.businessMonthly) };
        }
        const businessSavings = Math.round((1 - currentPricing.businessYearly / (currentPricing.businessMonthly * 12)) * 100);
        return { 
          price: currentPricing.localizedPriceString(currentPricing.businessYearly),
          originalPrice: currentPricing.localizedPriceString(currentPricing.businessMonthly * 12),
          savings: businessSavings
        };
      case 'enterprise':
        const basePrice = billingCycle === 'monthly' 
          ? currentPricing.enterpriseMonthly * enterpriseSeats
          : currentPricing.enterpriseYearly * enterpriseSeats;
        
        // Find volume discount
        let discount = 0;
        for (const tier of VOLUME_DISCOUNTS) {
          if (enterpriseSeats >= tier.minSeats && enterpriseSeats <= tier.maxSeats) {
            discount = tier.discount;
            break;
          }
        }
        
        const finalPrice = basePrice * (1 - discount);
        return { 
          price: currentPricing.localizedPriceString(finalPrice),
          originalPrice: discount > 0 ? currentPricing.localizedPriceString(basePrice) : undefined,
          savings: discount > 0 ? Math.round(discount * 100) : undefined
        };
    }
  };

  const getBillingLabel = () => {
    return billingCycle === 'monthly' ? '/month' : '/year';
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'essential': return <Shield className="w-10 h-10 text-gray-400" />;
      case 'family': return <Heart className="w-10 h-10 text-rose-400" />;
      case 'business': return <Building2 className="w-10 h-10 text-blue-400" />;
      case 'enterprise': return <Crown className="w-10 h-10 text-purple-400" />;
    }
  };

  const isPopular = (tier: SubscriptionTier) => tier === 'family';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Protection Plan</h2>
        <p className="text-gray-400">Flexible pricing for individuals, families, and businesses of all sizes</p>
      </div>

      {/* Region & Billing Selection */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v as Region)}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.flag} {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded-lg">
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
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {PRICING_TIERS.map((tier, index) => {
          const pricing = getTierPrice(tier.id);
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${
                isPopular(tier.id) 
                  ? 'bg-gradient-to-b from-rose-500/10 to-transparent border-rose-500/30 ring-1 ring-rose-500/50' 
                  : tier.id === 'enterprise'
                  ? 'bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/30'
                  : 'bg-gray-800/30 border-gray-700/50'
              }`}>
                {isPopular(tier.id) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {tier.id === 'enterprise' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Enterprise
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-400">{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="text-center py-4">
                    {pricing.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{pricing.originalPrice}</p>
                    )}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{pricing.price}</span>
                      {tier.id !== 'essential' && (
                        <span className="text-gray-400">{getBillingLabel()}</span>
                      )}
                    </div>
                    {pricing.savings && (
                      <Badge className="mt-2 bg-green-500/20 text-green-400">
                        Save {pricing.savings}%
                      </Badge>
                    )}
                    {tier.id === 'enterprise' && (
                      <p className="text-xs text-gray-500 mt-1">per seat/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
                    )}
                  </div>

                  {/* Enterprise seat selector */}
                  {tier.id === 'enterprise' && (
                    <div className="bg-purple-500/10 rounded-lg p-3 space-y-2">
                      <label className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Number of seats
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        value={enterpriseSeats}
                        onChange={(e) => setEnterpriseSeats(Math.max(1, parseInt(e.target.value) || 1))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      {enterpriseSeats >= 10 && (
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <Calculator className="w-3 h-3" />
                          Volume discount applied!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-2">
                    {tier.features.slice(0, tier.id === 'essential' ? 6 : 8).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    {tier.features.length > 8 && (
                      <p className="text-xs text-gray-500">+{tier.features.length - 8} more features</p>
                    )}
                  </div>

                  {/* Support & SLA */}
                  <div className="pt-2 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500">
                      <span className="text-gray-400">Support:</span> {tier.support}
                    </p>
                    {tier.sla && (
                      <p className="text-xs text-gray-500">
                        <span className="text-gray-400">SLA:</span> {tier.sla}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full mt-4 ${
                      isPopular(tier.id) 
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                        : tier.id === 'essential'
                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                        : tier.id === 'enterprise'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {tier.id === 'essential' ? 'Get Started Free' : 
                     tier.id === 'enterprise' ? 'Contact Sales' :
                     `Upgrade to ${tier.name}`}
                  </Button>

                  {/* Devices info */}
                  <p className="text-xs text-gray-500 text-center">
                    {tier.maxDevices === 9999 ? 'Unlimited devices' : `${tier.maxDevices} devices included`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Volume Discounts Table */}
      <Card className="bg-gray-800/30 border-gray-700/50 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            Enterprise Volume Discounts
          </CardTitle>
          <CardDescription>Save more as your team grows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VOLUME_DISCOUNTS.map((tier, i) => (
              <div key={i} className="bg-gray-700/30 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-400">
                  {tier.minSeats} - {tier.maxSeats === 999999 ? '∞' : tier.maxSeats} seats
                </p>
                <p className="text-lg font-bold text-green-400">{Math.round(tier.discount * 100)}% off</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Pricing Info */}
      <div className="text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" />
          Prices shown for {regions.find(r => r.id === selectedRegion)?.name} ({currentPricing?.currency})
        </p>
        <p className="mt-1">Taxes may apply based on your location • All prices in {currentPricing?.symbol || '$'}</p>
      </div>
    </div>
  );
}
