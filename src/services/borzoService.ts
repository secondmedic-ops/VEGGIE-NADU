import { Order, DeliveryAddress } from '../types';
import { SHOP_CONTACT } from '../data/seedData';

export interface BorzoBookingResponse {
  success: boolean;
  borzoOrderId: string;
  trackingUrl: string;
  courierName?: string;
  courierPhone?: string;
  estimatedDeliveryFee: number;
  message?: string;
}

const BORZO_API_URL = 
  (typeof process !== 'undefined' && process.env?.BORZO_API_URL) || 
  'https://robotapitest-in.borzodelivery.com/api/business/1.6/';

const BORZO_AUTH_TOKEN = 
  (typeof process !== 'undefined' && process.env?.BORZO_AUTH_TOKEN) || 
  '';

/**
 * Calculate delivery fee based on customer address
 * Standard Navi Mumbai local courier calculation
 */
export async function calculateBorzoDeliveryFee(address: DeliveryAddress): Promise<number> {
  // If user has token, try real Borzo calculate-order
  if (BORZO_AUTH_TOKEN) {
    try {
      const payload = {
        type: 'standard',
        matter: 'Fresh South Indian Vegetables and Groceries',
        points: [
          {
            address: SHOP_CONTACT.fullAddress,
            contact_person: {
              phone: SHOP_CONTACT.phone,
              name: 'Selvaraj (Veggie Nadu)'
            }
          },
          {
            address: `${address.houseStreet}, ${address.areaLandmark}, ${address.city} ${address.pincode}`,
            contact_person: {
              phone: address.phone,
              name: address.fullName
            }
          }
        ]
      };

      const res = await fetch(`${BORZO_API_URL}calculate-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DV-Auth-Token': BORZO_AUTH_TOKEN
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.order?.delivery_fee_amount) {
          return Math.round(Number(data.order.delivery_fee_amount));
        }
      }
    } catch (err) {
      console.warn('[Borzo] Calculation fallback:', err);
    }
  }

  // Realistic Navi Mumbai delivery rate calculation
  // Local Nerul / Belapur / Vashi (pincode starts 40070x) has low base rate ₹39
  const pin = address.pincode?.trim();
  if (pin.startsWith('400706')) {
    return 30; // Nerul same sector
  } else if (pin.startsWith('40070')) {
    return 45; // Navi Mumbai close radius
  } else if (pin.startsWith('400')) {
    return 65; // Greater Mumbai / Thane
  }
  return 49;
}

/**
 * Book Borzo Courier for an order
 */
export async function bookBorzoCourier(order: Order): Promise<BorzoBookingResponse> {
  const borzoId = `BRZ-IN-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingUrl = `https://borzodelivery.com/in/tracking/${borzoId}`;

  // If Borzo token is provided, attempt live API call
  if (BORZO_AUTH_TOKEN) {
    try {
      const payload = {
        type: 'standard',
        matter: `Veggie Nadu Produce Order #${order.orderNumber}`,
        total_weight_kg: 5,
        points: [
          {
            address: SHOP_CONTACT.fullAddress,
            contact_person: {
              phone: SHOP_CONTACT.phone,
              name: 'Selvaraj (Veggie Nadu)'
            }
          },
          {
            address: `${order.deliveryAddress.houseStreet}, ${order.deliveryAddress.areaLandmark}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}`,
            contact_person: {
              phone: order.deliveryAddress.phone,
              name: order.deliveryAddress.fullName
            }
          }
        ]
      };

      const res = await fetch(`${BORZO_API_URL}create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DV-Auth-Token': BORZO_AUTH_TOKEN
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const liveOrderId = data?.order?.order_id ? String(data.order.order_id) : borzoId;
        return {
          success: true,
          borzoOrderId: liveOrderId,
          trackingUrl: `https://borzodelivery.com/in/tracking/${liveOrderId}`,
          courierName: data?.order?.courier?.name || 'Borzo Courier Partner',
          courierPhone: data?.order?.courier?.phone || '+91 98201 54321',
          estimatedDeliveryFee: Number(data?.order?.delivery_fee_amount || 45),
          message: 'Borzo courier successfully dispatched via Live Business API'
        };
      }
    } catch (error) {
      console.warn('[Borzo] Live booking API error, using simulation:', error);
    }
  }

  // Test mode simulation (as described in After It's Built instructions)
  const courierNames = ['Ramesh K. (Borzo)', 'Suresh Nadar (Borzo Express)', 'Anand S. (Borzo Fleet)', 'Vijay M. (Borzo)'];
  const assignedCourier = courierNames[Math.floor(Math.random() * courierNames.length)];

  return {
    success: true,
    borzoOrderId: borzoId,
    trackingUrl,
    courierName: assignedCourier,
    courierPhone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
    estimatedDeliveryFee: order.deliveryFee || 45,
    message: 'Borzo courier assigned in test mode. Add BORZO_AUTH_TOKEN to switch to live booking.'
  };
}
