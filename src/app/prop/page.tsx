"use client";
import React, { useState } from 'react';
import {  CreditCard, Eye, EyeOff, Gift, Heart, LogOut, MapPin, Package, Shield, User } from 'lucide-react';
import Image from "next/image";

const UserAccountPage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [showPassword, setShowPassword] = useState(false);

    const user = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "/api/placeholder/150/150",
        rewardPoints: 2500,
        vipStatus: "Gold",
        memberSince: "January 2023",
        lastLogin: "2024-02-12 14:30",
        preferences: {
            language: "English",
            currency: "USD",
            newsletter: true,
            smsNotifications: false
        }
    };

    const orders = [
        {
            id: "ORD-123",
            date: "2024-02-10",
            status: "Delivered",
            total: 129.99,
            items: [
                { name: "Wireless Headphones", quantity: 1, price: 79.99 },
                { name: "Phone Case", quantity: 2, price: 24.99 }
            ],
            tracking: "1Z999AA1234567890",
            shippingAddress: "123 Main St, New York, NY 10001"
        },
        {
            id: "ORD-124",
            date: "2024-02-08",
            status: "In Transit",
            total: 79.50,
            items: [
                { name: "Smart Watch Band", quantity: 1, price: 79.50 }
            ],
            tracking: "1Z999AA1234567891",
            shippingAddress: "123 Main St, New York, NY 10001"
        }
    ];

    const addresses = [
        {
            id: 1,
            type: "Home",
            isDefault: true,
            fullName: "Jane Smith",
            street: "123 Main Street",
            unit: "Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
            phone: "+1 (555) 123-4567"
        },
        {
            id: 2,
            type: "Work",
            isDefault: false,
            fullName: "Jane Smith",
            street: "456 Business Ave",
            unit: "Floor 12",
            city: "New York",
            state: "NY",
            zip: "10002",
            country: "United States",
            phone: "+1 (555) 987-6543"
        }
    ];

    const paymentMethods = [
        {
            id: 1,
            type: "Visa",
            last4: "4242",
            expiry: "12/25",
            isDefault: true,
            billingAddress: "123 Main Street, New York, NY 10001"
        },
        {
            id: 2,
            type: "Mastercard",
            last4: "8888",
            expiry: "08/26",
            isDefault: false,
            billingAddress: "456 Business Ave, New York, NY 10002"
        }
    ];

    const wishlist = [
        {
            id: 1,
            name: "Premium Smartwatch",
            price: 299.99,
            image: "/api/placeholder/100/100",
            inStock: true,
            dateAdded: "2024-02-01"
        },
        {
            id: 2,
            name: "Wireless Earbuds Pro",
            price: 199.99,
            image: "/api/placeholder/100/100",
            inStock: false,
            dateAdded: "2024-01-25"
        }
    ];

    const rewards = {
        points: 2500,
        tier: "Gold",
        nextTier: "Platinum",
        pointsToNextTier: 1500,
        availableCoupons: [
            { id: 1, code: "SAVE20", discount: "20% off", expires: "2024-03-01" },
            { id: 2, code: "FREE-SHIP", discount: "Free Shipping", expires: "2024-02-28" }
        ],
        pointsHistory: [
            { date: "2024-02-10", points: 150, description: "Purchase ORD-123" },
            { date: "2024-02-08", points: 80, description: "Purchase ORD-124" }
        ]
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="space-y-6 ">
                        <h2 className="text-2xl font-semibold">Order History</h2>
                        {orders.map(order => (
                            <div key={order.id} className="border rounded-lg p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Order {order.id}</h3>
                                        <p className="text-gray-500">Placed on {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">${order.total.toFixed(2)}</div>
                                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Items</h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between py-2">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Shipping Details</h4>
                                    <p className="text-gray-600">Tracking: {order.tracking}</p>
                                    <p className="text-gray-600">Address: {order.shippingAddress}</p>
                                </div>

                                <div className="flex gap-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Track Order
                                    </button>
                                    <button className="px-4 py-2 border rounded hover:bg-gray-50">
                                        View Invoice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'addresses':
                return (
                    <div className="space-y-6 ">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Saved Addresses</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Add New Address
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {addresses.map(address => (
                                <div key={address.id} className="border rounded-lg p-6 relative">
                                    {address.isDefault && (
                                        <span className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Default
                    </span>
                                    )}
                                    <h3 className="font-medium mb-2">{address.type}</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p>{address.fullName}</p>
                                        <p>{address.street}</p>
                                        {address.unit && <p>{address.unit}</p>}
                                        <p>{address.city}, {address.state} {address.zip}</p>
                                        <p>{address.country}</p>
                                        <p>{address.phone}</p>
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-6 ">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Payment Methods</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Add Payment Method
                            </button>
                        </div>

                        <div className="space-y-4">
                            {paymentMethods.map(method => (
                                <div key={method.id} className="border rounded-lg p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="h-8 w-8 text-gray-600" />
                                        <div>
                                            <div className="font-medium">
                                                {method.type} ending in {method.last4}
                                            </div>
                                            <div className="text-gray-500">Expires {method.expiry}</div>
                                            <div className="text-sm text-gray-500">{method.billingAddress}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {method.isDefault && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Default
                      </span>
                                        )}
                                        <button className="text-blue-600 hover:underline">Edit</button>
                                        <button className="text-red-600 hover:underline">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6 ">
                        <h2 className="text-2xl font-semibold">Security Settings</h2>

                        <div className="space-y-6">
                            <div className="border rounded-lg p-6">
                                <h3 className="font-medium mb-4">Change Password</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full px-4 py-2 border rounded"
                                            />
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">New Password</label>
                                        <input type="password" className="w-full px-4 py-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                        <input type="password" className="w-full px-4 py-2 border rounded" />
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="border rounded-lg p-6">
                                <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                                <p className="text-gray-600 mb-4">
                                    Add an extra layer of security to your account by enabling two-factor authentication.
                                </p>
                                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                    Enable 2FA
                                </button>
                            </div>

                            <div className="border rounded-lg p-6">
                                <h3 className="font-medium mb-4">Recent Login Activity</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2">
                                        <span>Chrome on Windows</span>
                                        <span className="text-gray-500">2024-02-12 14:30</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Safari on iPhone</span>
                                        <span className="text-gray-500">2024-02-11 09:15</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'wishlist':
                return (
                    <div className="space-y-6 ">
                        <h2 className="text-2xl font-semibold">My Wishlist</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {wishlist.map(item => (
                                <div key={item.id} className="border rounded-lg p-6 flex gap-4">
                                    <Image width={100} height={100} src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-lg font-medium text-blue-600">${item.price}</p>
                                        <p className="text-sm text-gray-500">Added on {item.dateAdded}</p>
                                        <div className="mt-2 space-x-4">
                                            <button
                                                className={`px-4 py-2 rounded ${
                                                    item.inStock
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                disabled={!item.inStock}
                                            >
                                                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                            <button className="text-red-600 hover:underline">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'rewards':
                return (
                    <div className="space-y-6 ">
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Rewards Summary</h2>
                                <div className="text-right">
                                    <div className="font-medium text-xl">${rewards.points} Points</div>
                                    <div className="text-gray-600 text-sm">VIP Status: {rewards.tier}</div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                You are {rewards.pointsToNextTier} points away from {rewards.nextTier} status!
                            </p>
                        </div>

                        {/* Available Coupons */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium">Available Coupons</h3>
                            {rewards.availableCoupons.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {rewards.availableCoupons.map(coupon => (
                                        <div key={coupon.id} className="border rounded-lg p-4">
                                            <h4 className="font-medium">{coupon.code}</h4>
                                            <p className="text-gray-600">{coupon.discount}</p>
                                            <p className="text-sm text-gray-500">Expires on {coupon.expires}</p>
                                            <button className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                Apply Coupon
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No available coupons at this time.</p>
                            )}
                        </div>

                        {/* Points History */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-medium">Points History</h3>
                            {rewards.pointsHistory.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Points
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {rewards.pointsHistory.map((point, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {point.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {point.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                                                    +{point.points}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-600">No points history available.</p>
                            )}
                        </div>
                    </div>
                );

            case 'account':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Account Details</h2>
                        <div className="bg-gray-50 rounded-lg p-6 flex gap-4">
                            <Image width={80} height={80} src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full" />
                            <div className="flex-1">
                                <h3 className="font-medium text-xl">{user.name}</h3>
                                <p className="text-gray-600">
                                    Member since {user.memberSince}, Last login: {user.lastLogin}
                                </p>
                                <div className="text-gray-600">
                                    <a
                                        href="mailto:jane.smith@example.com"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {user.email}
                                    </a>
                                    <div>
                                        {user.phone}
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="border rounded-lg p-6">
                            <h3 className="font-medium mb-4">Preferences</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Language</span>
                                    <span className="font-semibold">{user.preferences.language}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Currency</span>
                                    <span className="font-semibold">{user.preferences.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Newsletter Subscriptions</span>
                                    <span>{user.preferences.newsletter ? 'Enabled' : 'Disabled'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>SMS Notifications</span>
                                    <span>{user.preferences.smsNotifications ? 'Enabled' : 'Disabled'}</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Edit Preferences
                            </button>
                        </div>
                    </div>
                );

            case 'logout':
                return (
                    <div>
                        <h2>Logout</h2>
                        <p>Are you sure you want to log out?</p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Log Out
                        </button>
                    </div>
                );

            default:
                return <div>Select a Tab</div>;
        }
    };

    return (
        <div className="container mx-auto py-8 ">
            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:col-span-1">
                    <nav className="space-y-4">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'orders'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Package className="h-5 w-5" />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('addresses')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'addresses'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <MapPin className="h-5 w-5" />
                            Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'payments'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <CreditCard className="h-5 w-5" />
                            Payment Methods
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'security'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Shield className="h-5 w-5" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'wishlist'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Heart className="h-5 w-5" />
                            Wishlist
                        </button>
                        <button
                            onClick={() => setActiveTab('rewards')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'rewards'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Gift className="h-5 w-5" />
                            Rewards
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'account'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <User className="h-5 w-5" />
                            Account Details
                        </button>
                        <button
                            onClick={() => setActiveTab('logout')}
                            className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg transition-colors duration-200
                  ${activeTab === 'logout'
                                ? 'bg-gray-100 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    {renderTab()}
                </main>
            </div>
        </div>
    );
};

export default UserAccountPage;