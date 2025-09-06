// app/store/page.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import { FaCrown, FaGem, FaCoins, FaShoppingCart, FaCheck, FaFire, FaStar, FaShieldAlt, FaMagic, FaRocket } from "react-icons/fa";

interface PricingTier {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  popular?: boolean;
  features: string[];
  icon: React.ReactNode;
  savings?: string;
}

interface GameItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: "coins" | "gems";
  category: "avatar" | "effects" | "boosts" | "emotes";
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: React.ReactNode;
  owned?: boolean;
}

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("vip");
  const [cart, setCart] = useState<number[]>([]);
  const [userCoins, setUserCoins] = useState(1250);
  const [userGems, setUserGems] = useState(50);

  const pricingTiers: PricingTier[] = [
    {
      id: 1,
      name: "Starter Pack",
      price: 4.99,
      description: "Perfect for beginners",
      features: [
        "500 Coins",
        "50 Gems",
        "Starter Avatar Frame",
        "Common Profile Effect",
        "7-Day XP Boost"
      ],
      icon: <FaGem className="text-blue-500" />,
      savings: "10% value"
    },
    {
      id: 2,
      name: "VIP Membership",
      price: 9.99,
      originalPrice: 14.99,
      popular: true,
      description: "Most popular choice",
      features: [
        "1,200 Coins",
        "120 Gems",
        "Exclusive VIP Badge",
        "Animated Avatar Frame",
        "30-Day XP Boost",
        "Priority Matchmaking",
        "VIP-only emotes"
      ],
      icon: <FaCrown className="text-yellow-500" />,
      savings: "33% value"
    },
    {
      id: 3,
      name: "Elite Bundle",
      price: 19.99,
      originalPrice: 29.99,
      description: "For serious players",
      features: [
        "3,000 Coins",
        "300 Gems",
        "Legendary Avatar Frame",
        "Exclusive Animation Effects",
        "90-Day XP Boost",
        "Double Coin Earnings",
        "Custom Name Color",
        "Early Access to Features"
      ],
      icon: <FaStar className="text-purple-500" />,
      savings: "40% value"
    }
  ];

  const gameItems: GameItem[] = [
    {
      id: 101,
      name: "Golden Avatar Frame",
      description: "Shiny gold frame for your profile",
      price: 200,
      currency: "coins",
      category: "avatar",
      rarity: "rare",
      icon: <FaStar className="text-yellow-500" />,
      owned: false
    },
    {
      id: 102,
      name: "Fire Trail Effect",
      description: "Leave a trail of fire behind your cursor",
      price: 150,
      currency: "gems",
      category: "effects",
      rarity: "epic",
      icon: <FaFire className="text-orange-500" />,
      owned: false
    },
    {
      id: 103,
      name: "XP Boost (3 Days)",
      description: "Earn 50% more XP for 3 days",
      price: 75,
      currency: "gems",
      category: "boosts",
      rarity: "common",
      icon: <FaRocket className="text-blue-500" />,
      owned: false
    },
    {
      id: 104,
      name: "Rainbow Name",
      description: "Your name appears in rainbow colors",
      price: 300,
      currency: "gems",
      category: "effects",
      rarity: "legendary",
      icon: <FaMagic className="text-purple-500" />,
      owned: false
    },
    {
      id: 105,
      name: "Shield Emote",
      description: "Show off your defensive skills",
      price: 100,
      currency: "coins",
      category: "emotes",
      rarity: "common",
      icon: <FaShieldAlt className="text-gray-500" />,
      owned: true
    },
    {
      id: 106,
      name: "Diamond Avatar Frame",
      description: "Exclusive diamond-encrusted frame",
      price: 500,
      currency: "gems",
      category: "avatar",
      rarity: "legendary",
      icon: <FaGem className="text-teal-500" />,
      owned: false
    },
  ];

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(itemId => itemId !== id));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-100";
      case "rare": return "border-blue-300 bg-blue-100";
      case "epic": return "border-purple-300 bg-purple-100";
      case "legendary": return "border-yellow-300 bg-yellow-100";
      default: return "border-gray-300 bg-gray-100";
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-700";
      case "rare": return "text-blue-700";
      case "epic": return "text-purple-700";
      case "legendary": return "text-yellow-700";
      default: return "text-gray-700";
    }
  };

  const cartItems = [...pricingTiers, ...gameItems].filter(item => cart.includes(item.id));
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Game Store</h1>
          <p className="text-gray-600">Unlock exclusive items and boost your gameplay</p>
        </div>

        {/* Currency Balance */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Balance</h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-400" />
                  <span className="text-2xl font-bold">{userCoins}</span>
                  <span className="text-blue-200">Coins</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGem className="text-teal-300" />
                  <span className="text-2xl font-bold">{userGems}</span>
                  <span className="text-blue-200">Gems</span>
                </div>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Add Currency
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("vip")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "vip" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              VIP Packages
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "items" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Game Items
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors relative ${activeTab === "cart" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Shopping Cart
              {cart.length > 0 && (
                <span className="absolute top-2 right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* VIP Packages */}
        {activeTab === "vip" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">VIP Memberships</h2>
            <p className="text-gray-600">Unlock exclusive benefits and boost your gaming experience</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div key={tier.id} className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${tier.popular ? "border-yellow-400 ring-2 ring-yellow-200 ring-opacity-50" : "border-gray-200"}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="flex justify-center text-3xl mb-4">
                      {tier.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                      {tier.originalPrice && (
                        <span className="ml-2 text-lg text-gray-500 line-through">${tier.originalPrice}</span>
                      )}
                    </div>
                    {tier.savings && (
                      <p className="text-green-600 font-medium text-sm mt-1">Save {tier.savings}</p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => addToCart(tier.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      tier.popular 
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {cart.includes(tier.id) ? "Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Items */}
        {activeTab === "items" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Game Items</h2>
            <p className="text-gray-600">Customize your experience with these exclusive items</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameItems.map((item) => (
                <div key={item.id} className={`bg-white rounded-2xl shadow-lg p-4 border-2 ${getRarityColor(item.rarity)} transition-all hover:shadow-xl`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl">
                      {item.icon}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRarityText(item.rarity)} ${getRarityColor(item.rarity)}`}>
                      {item.rarity.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {item.currency === "coins" ? (
                        <FaCoins className="text-yellow-500" />
                      ) : (
                        <FaGem className="text-teal-500" />
                      )}
                      <span className="font-semibold">{item.price}</span>
                    </div>
                    
                    {item.owned ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Owned
                      </span>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        {cart.includes(item.id) ? "Added" : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shopping Cart */}
        {activeTab === "cart" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <FaShoppingCart className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some items to get started!</p>
                <button
                  onClick={() => setActiveTab("vip")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse VIP Packages
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Items ({cart.length})</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-gray-600 text-sm">${item.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${(cartTotal * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors mb-3">
                    Proceed to Checkout
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Your payment is secure and encrypted. By completing this purchase, you agree to our Terms of Service.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}