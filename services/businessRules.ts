
import { User, UserRole, Meet, MeetCategory } from '../types';

/**
 * Haversine formula to calculate distance between two points in km
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    0.5 - Math.cos(dLat)/2 + 
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    (1 - Math.cos(dLon))/2;

  return R * 2 * Math.asin(Math.sqrt(a));
};

export const canUserCreateMeet = (user: User, existingMeets: Meet[]): { allowed: boolean; reason?: string } => {
  if (user.role === UserRole.GUEST) {
    return { allowed: false, reason: 'Los invitados no pueden crear encuentros.' };
  }

  if (user.role === UserRole.ADMIN) {
    const activeAdminMeet = existingMeets.find(m => m.creatorId === user.id && m.endTime > Date.now());
    if (activeAdminMeet) {
      return { allowed: false, reason: 'Ya tienes un encuentro activo. No puedes crear otro hasta que finalice.' };
    }
    return { allowed: true };
  }

  if (user.role === UserRole.USER) {
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    if (user.lastCreatedMeetAt && (Date.now() - user.lastCreatedMeetAt < oneWeekInMs)) {
      return { allowed: false, reason: 'Solo puedes crear un encuentro por semana.' };
    }
    return { allowed: true };
  }

  return { allowed: false };
};

export const isProximityAllowed = (lat: number, lng: number, meets: Meet[]): boolean => {
  const PROXIMITY_RADIUS_KM = 2.0;
  return !meets.some(m => {
    // Only check active meets
    if (m.endTime < Date.now()) return false;
    return calculateDistance(lat, lng, m.latitude, m.longitude) < PROXIMITY_RADIUS_KM;
  });
};

export const filterMeetsByRole = (meets: Meet[], user: User | null): Meet[] => {
  const now = Date.now();
  return meets.filter(meet => {
    // 1. Expiry check
    if (meet.endTime < now) return false;

    // 2. Capacity check
    if (meet.currentVehicles >= meet.maxVehicles) return false;

    // 3. Privacy check
    if (!meet.isPrivate) return true;
    
    // Private meets: Guests can't see them
    if (!user || user.role === UserRole.GUEST) return false;

    // Admin sees everything
    if (user.role === UserRole.ADMIN) return true;

    // Users must be in the crew
    return user.crewIds.includes(meet.crewId || '');
  });
};
