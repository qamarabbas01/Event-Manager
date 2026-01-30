import techImg from '$lib/assets/images/tech.png';
import musicImg from '$lib/assets/images/music.png';
import startupImg from '$lib/assets/images/startup.png';
import foodImg from '$lib/assets/images/food.png';
import artImg from '$lib/assets/images/art.png';
import partyImg from '$lib/assets/images/party.png';

export type EventImageKey = 'tech' | 'music' | 'startup' | 'food' | 'art' | 'party';

export const eventImageMap: Record<EventImageKey, string> = {
	tech: techImg,
	music: musicImg,
	startup: startupImg,
	food: foodImg,
	art: artImg,
	party: partyImg
};
