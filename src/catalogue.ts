export type CatalogueProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  tags?: string[];
};

export function technicalVisual(category: string) {
  const c = category.toLowerCase();
  if (c.includes('bearing')) return 'catalog-visuals/bearing.svg';
  if (c.includes('collet')) return 'catalog-visuals/collet.svg';
  if (c.includes('holder') || c.includes('chuck') || c.includes('pull stud')) return 'catalog-visuals/holder.svg';
  return 'catalog-visuals/accessory.svg';
}

export function safeProductImage(image: string | undefined, category: string) {
  if (!image || /^https?:\/\//i.test(image)) return technicalVisual(category);
  return image;
}

export function technicalSpecs(product: CatalogueProduct) {
  const tags = (product.tags || []).map((tag) => tag.trim()).filter(Boolean);
  const specs: Array<[string, string]> = [];
  const add = (label: string, values: string[]) => {
    const value = values.find(Boolean);
    if (value) specs.push([label, value]);
  };

  add('Series / size', tags.filter((tag) => /\d/.test(tag) && !/^P?\d+$/i.test(tag)));
  add('Interface', tags.filter((tag) => /^(BT|BBT|ISO|SK|HSK)/i.test(tag)));
  add('Tool / bearing type', tags.filter((tag) => /bearing|holder|chuck|collet|milling|boring|drill|vice|spanner|stud|centre|center/i.test(tag)));
  add('Seal / execution', tags.filter((tag) => /2RS|2Z|OPEN|SHIELDED|SEALED|C3|P0|DIN/i.test(tag)));
  add('Dimensions / reach', tags.filter((tag) => /mm|\d+L$/i.test(tag)));

  return specs.length ? specs : [['Catalogue reference', product.category]];
}
