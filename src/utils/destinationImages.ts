// Destination-specific image mapping using high-quality Pexels images
export const getDestinationImage = (destination: string): string => {
  const destinationLower = destination.toLowerCase();
  
  // Japan destinations
  if (destinationLower.includes('tokyo') || destinationLower.includes('japan')) {
    return 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // France destinations
  if (destinationLower.includes('paris') || destinationLower.includes('france')) {
    return 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Indonesia/Bali destinations
  if (destinationLower.includes('bali') || destinationLower.includes('indonesia')) {
    return 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Thailand destinations
  if (destinationLower.includes('thailand') || destinationLower.includes('bangkok')) {
    return 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Italy destinations
  if (destinationLower.includes('italy') || destinationLower.includes('rome') || destinationLower.includes('venice')) {
    return 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Spain destinations
  if (destinationLower.includes('spain') || destinationLower.includes('barcelona') || destinationLower.includes('madrid')) {
    return 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Germany destinations
  if (destinationLower.includes('germany') || destinationLower.includes('berlin') || destinationLower.includes('munich')) {
    return 'https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // UK/England destinations
  if (destinationLower.includes('london') || destinationLower.includes('england') || destinationLower.includes('uk')) {
    return 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // USA destinations
  if (destinationLower.includes('new york') || destinationLower.includes('nyc')) {
    return 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (destinationLower.includes('usa') || destinationLower.includes('america')) {
    return 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Australia destinations
  if (destinationLower.includes('australia') || destinationLower.includes('sydney')) {
    return 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Canada destinations
  if (destinationLower.includes('canada') || destinationLower.includes('toronto') || destinationLower.includes('vancouver')) {
    return 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Mexico destinations
  if (destinationLower.includes('mexico') || destinationLower.includes('cancun')) {
    return 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Greece destinations
  if (destinationLower.includes('greece') || destinationLower.includes('santorini') || destinationLower.includes('athens')) {
    return 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Netherlands destinations
  if (destinationLower.includes('netherlands') || destinationLower.includes('amsterdam')) {
    return 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Portugal destinations
  if (destinationLower.includes('portugal') || destinationLower.includes('lisbon')) {
    return 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Turkey destinations
  if (destinationLower.includes('turkey') || destinationLower.includes('istanbul')) {
    return 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Egypt destinations
  if (destinationLower.includes('egypt') || destinationLower.includes('cairo')) {
    return 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // India destinations
  if (destinationLower.includes('india') || destinationLower.includes('delhi') || destinationLower.includes('mumbai')) {
    return 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // China destinations
  if (destinationLower.includes('china') || destinationLower.includes('beijing') || destinationLower.includes('shanghai')) {
    return 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // South Korea destinations
  if (destinationLower.includes('korea') || destinationLower.includes('seoul')) {
    return 'https://images.pexels.com/photos/2376997/pexels-photo-2376997.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Singapore destinations
  if (destinationLower.includes('singapore')) {
    return 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Dubai/UAE destinations
  if (destinationLower.includes('dubai') || destinationLower.includes('uae')) {
    return 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Morocco destinations
  if (destinationLower.includes('morocco') || destinationLower.includes('marrakech')) {
    return 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // South Africa destinations
  if (destinationLower.includes('south africa') || destinationLower.includes('cape town')) {
    return 'https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Brazil destinations
  if (destinationLower.includes('brazil') || destinationLower.includes('rio')) {
    return 'https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Argentina destinations
  if (destinationLower.includes('argentina') || destinationLower.includes('buenos aires')) {
    return 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Peru destinations
  if (destinationLower.includes('peru') || destinationLower.includes('machu picchu')) {
    return 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Iceland destinations
  if (destinationLower.includes('iceland') || destinationLower.includes('reykjavik')) {
    return 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Norway destinations
  if (destinationLower.includes('norway') || destinationLower.includes('oslo')) {
    return 'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Sweden destinations
  if (destinationLower.includes('sweden') || destinationLower.includes('stockholm')) {
    return 'https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Denmark destinations
  if (destinationLower.includes('denmark') || destinationLower.includes('copenhagen')) {
    return 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Czech Republic destinations
  if (destinationLower.includes('czech') || destinationLower.includes('prague')) {
    return 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Austria destinations
  if (destinationLower.includes('austria') || destinationLower.includes('vienna')) {
    return 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Switzerland destinations
  if (destinationLower.includes('switzerland') || destinationLower.includes('zurich')) {
    return 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // New Zealand destinations
  if (destinationLower.includes('new zealand') || destinationLower.includes('auckland')) {
    return 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Philippines destinations
  if (destinationLower.includes('philippines') || destinationLower.includes('manila')) {
    return 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Vietnam destinations
  if (destinationLower.includes('vietnam') || destinationLower.includes('hanoi')) {
    return 'https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Malaysia destinations
  if (destinationLower.includes('malaysia') || destinationLower.includes('kuala lumpur')) {
    return 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  // Default fallback image for unknown destinations
  return 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800';
};

// Helper function to get multiple images for a destination (for galleries, etc.)
export const getDestinationImages = (destination: string, count: number = 3): string[] => {
  const destinationLower = destination.toLowerCase();
  const images: string[] = [];
  
  // Add primary image
  images.push(getDestinationImage(destination));
  
  // Add additional images based on destination
  if (destinationLower.includes('tokyo') || destinationLower.includes('japan')) {
    images.push(
      'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  } else if (destinationLower.includes('paris') || destinationLower.includes('france')) {
    images.push(
      'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  } else if (destinationLower.includes('bali') || destinationLower.includes('indonesia')) {
    images.push(
      'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  } else {
    // Generic travel images for other destinations
    images.push(
      'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  }
  
  return images.slice(0, count);
};