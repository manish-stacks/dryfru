import { useState, useEffect } from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Save,
    Settings as SettingsIcon
} from 'lucide-react';
import axios from 'axios';
function Settings() {
    const [settings, setSettings] = useState({
        siteName: '',
        siteUrl: '',
        copounEnables: false,
        paymentGateway: {
            key: '',
            secret: '',
            provider: ''
        },
        currency: 'INR',
        isTaxEnables: false,
        taxRate: 0,
        shippingEnabled: true,
        shippingCost: 0,
        freeShippingThreshold: 0,
        onlinePaymentAvailable: false,
        codAvailable: false,
        smtp_email: '',
        smtp_password: '',
        supportEmail: '',
        maintenanceMode: false,
        logoUrl: '',
        socialMediaLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            youtube: ''
        },
        contactNumber: '',
        address: '',
        analytics: {
            googleAnalyticsId: '',
            facebookPixelId: ''
        },
        lowStockThreshold: 5
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('https://api.dyfru.com/api/v1/admin/settings');
            const data = await response.json();
            console.log(data)
            setSettings(data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleChange = (e, section = null, subsection = null) => {
        const { name, value, type, checked } = e.target;

        setSettings(prev => {
            if (section && subsection) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [subsection]: value
                    }
                };
            } else if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [name]: value
                    }
                };
            } else {
                return {
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put('https://api.dyfru.com/api/v1/admin/settings/678258cf87e91e662ce73708', settings);

            console.log(response.data);
            alert('Settings updated successfully!');

        } catch (error) {
            console.error('Error updating settings:', error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <SettingsIcon className="w-6 h-6 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Basic Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                    placeholder="Enter site name"
                                />
                            </div>
                            <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="maintenanceMode"
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Maintenance Mode
                                    </label>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${settings.maintenanceMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {settings.maintenanceMode ? 'Enabled' : 'Active'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Site URL
                                </label>
                                <input
                                    type="url"
                                    name="siteUrl"
                                    value={settings.siteUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-white w-full rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
                                <input
                                    type="checkbox"
                                    id="copounEnables"
                                    name="copounEnables"
                                    checked={settings.copounEnables}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="copounEnables" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Enable Coupon System
                                </label>
                                <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${settings.copounEnables ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {settings.copounEnables ? 'Active' : 'Disabled'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Provider
                                    </label>
                                    <input
                                        type="text"
                                        name="provider"
                                        value={settings?.paymentGateway?.provider || ''}
                                        onChange={(e) => handleChange(e, 'paymentGateway')}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                        placeholder="e.g., Stripe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        API Key
                                    </label>
                                    <input
                                        type="text"
                                        name="key"
                                        value={settings?.paymentGateway?.key || ''}
                                        onChange={(e) => handleChange(e, 'paymentGateway')}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                        placeholder="Enter API key"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        API Secret
                                    </label>
                                    <input
                                        type="password"
                                        name="secret"
                                        value={settings?.paymentGateway?.secret || ''}
                                        onChange={(e) => handleChange(e, 'paymentGateway')}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Payment Methods</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="codAvailable"
                                        name="codAvailable"
                                        checked={settings.codAvailable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div>
                                        <label htmlFor="codAvailable" className="text-sm font-medium text-gray-700 cursor-pointer">
                                            Cash on Delivery
                                        </label>
                                        <p className="text-xs text-gray-500">Allow customers to pay on delivery</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${settings.codAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                    {settings.codAvailable ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="onlinePaymentAvailable"
                                        name="onlinePaymentAvailable"
                                        checked={settings.onlinePaymentAvailable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div>
                                        <label htmlFor="onlinePaymentAvailable" className="text-sm font-medium text-gray-700 cursor-pointer">
                                            Online Payment
                                        </label>
                                        <p className="text-xs text-gray-500">Accept online payments via gateway</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${settings.onlinePaymentAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                    {settings.onlinePaymentAvailable ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Shipping & Tax */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Shipping & Tax</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="shippingEnabled"
                                        checked={settings.shippingEnabled}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Enable Shipping
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shipping Cost
                                    </label>
                                    <input
                                        type="number"
                                        name="shippingCost"
                                        value={settings.shippingCost}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Free Shipping Threshold
                                    </label>
                                    <input
                                        type="number"
                                        name="freeShippingThreshold"
                                        value={settings.freeShippingThreshold}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isTaxEnables"
                                        checked={settings.isTaxEnables}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Enable Tax
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        value={settings.taxRate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Settings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SMTP Email
                                </label>
                                <input
                                    type="email"
                                    name="smtp_email"
                                    value={settings.smtp_email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SMTP Password
                                </label>
                                <input
                                    type="password"
                                    name="smtp_password"
                                    value={settings.smtp_password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Facebook className="w-5 h-5 text-blue-600" />
                                <input
                                    type="url"
                                    name="facebook"
                                    value={settings.socialMediaLinks.facebook}
                                    onChange={(e) => handleChange(e, 'socialMediaLinks')}
                                    placeholder="Facebook URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Twitter className="w-5 h-5 text-blue-400" />
                                <input
                                    type="url"
                                    name="twitter"
                                    value={settings.socialMediaLinks.twitter}
                                    onChange={(e) => handleChange(e, 'socialMediaLinks')}
                                    placeholder="Twitter URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Instagram className="w-5 h-5 text-pink-600" />
                                <input
                                    type="url"
                                    name="instagram"
                                    value={settings.socialMediaLinks.instagram}
                                    onChange={(e) => handleChange(e, 'socialMediaLinks')}
                                    placeholder="Instagram URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Linkedin className="w-5 h-5 text-blue-700" />
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={settings.socialMediaLinks.linkedin}
                                    onChange={(e) => handleChange(e, 'socialMediaLinks')}
                                    placeholder="LinkedIn URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;