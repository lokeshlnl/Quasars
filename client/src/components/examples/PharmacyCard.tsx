import PharmacyCard from '../PharmacyCard';

export default function PharmacyCardExample() {
  return (
    <div className="space-y-4 p-6">
      <PharmacyCard
        name="Green Valley Pharmacy"
        address="123 Main Street, Valley Town"
        distance="0.5 km"
        phone="(555) 123-4567"
        hours="Open until 8:00 PM"
        stockStatus="in-stock"
        medicationName="Methylphenidate (Ritalin)"
        onClick={() => console.log('Pharmacy clicked')}
        onCall={() => console.log('Calling pharmacy')}
      />
      <PharmacyCard
        name="Mountain View Drugs"
        address="456 Hill Road, Highland"
        distance="1.2 km"
        phone="(555) 987-6543"
        hours="Open 24 hours"
        stockStatus="low-stock"
        medicationName="Aripiprazole (Abilify)"
        onClick={() => console.log('Pharmacy clicked')}
        onCall={() => console.log('Calling pharmacy')}
      />
      <PharmacyCard
        name="Community Health Pharmacy"
        address="789 Center Ave, Downtown"
        distance="2.1 km"
        phone="(555) 456-7890"
        hours="Closed (Opens at 9:00 AM)"
        stockStatus="out-of-stock"
        medicationName="Sertraline (Zoloft)"
        onClick={() => console.log('Pharmacy clicked')}
        onCall={() => console.log('Calling pharmacy')}
      />
    </div>
  );
}