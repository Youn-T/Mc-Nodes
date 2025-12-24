import React, { useState } from 'react';

export const ItemCreator: React.FC = () => {
  const [itemData, setItemData] = useState({
    identifier: 'custom:my_item',
    displayName: 'My Custom Item',
    maxStack: 64,
    handEquipped: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateJson = () => {
    const json = {
      format_version: "1.20.50",
      "minecraft:item": {
        description: {
          identifier: itemData.identifier,
          menu_category: {
            category: "items"
          }
        },
        components: {
          "minecraft:display_name": {
            value: itemData.displayName
          },
          "minecraft:max_stack_size": Number(itemData.maxStack),
          "minecraft:hand_equipped": itemData.handEquipped
        }
      }
    };
    alert(JSON.stringify(json, null, 2));
  };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>Item Creator</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <label>
          Identifier (e.g., custom:sword):
          <input 
            type="text" 
            name="identifier" 
            value={itemData.identifier} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label>
          Display Name:
          <input 
            type="text" 
            name="displayName" 
            value={itemData.displayName} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label>
          Max Stack Size:
          <input 
            type="number" 
            name="maxStack" 
            value={itemData.maxStack} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            name="handEquipped" 
            checked={itemData.handEquipped} 
            onChange={handleChange}
          />
          Hand Equipped
        </label>

        <button onClick={generateJson} style={{ marginTop: '1rem' }}>
          Generate JSON
        </button>
      </div>
    </div>
  );
};
