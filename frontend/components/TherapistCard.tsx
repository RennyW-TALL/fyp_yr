import React from 'react';

interface TherapistCardProps {
  id: number;
  name: string;
  gender: string;
  specialization: string;
  profileImage: string;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  id,
  name,
  gender,
  specialization,
  profileImage
}) => {
  const getImageUrl = (imageKey: string) => {
    if (!imageKey) return '/default-avatar.png';
    const decodedKey = decodeURIComponent(imageKey);
    return `https://yr-fyp-profile-images.s3.ap-southeast-1.amazonaws.com/${decodedKey}`;
  };

  const getGenderStyles = (gender: string) => {
    if (gender?.toLowerCase() === 'male') {
      return {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        accent: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
    } else {
      return {
        border: 'border-pink-200',
        bg: 'bg-pink-50',
        accent: 'text-pink-700',
        button: 'bg-pink-600 hover:bg-pink-700'
      };
    }
  };

  const styles = getGenderStyles(gender);

  return (
    <div className={`${styles.bg} ${styles.border} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
          <img
            src={getImageUrl(profileImage)}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
        </div>
        
        <h3 className={`text-lg font-bold ${styles.accent} mb-1`}>
          {name}
        </h3>
        
        <p className="text-sm text-slate-600 mb-2 capitalize">
          {gender}
        </p>
        
        <p className={`text-sm ${styles.accent} font-medium mb-4`}>
          {specialization}
        </p>
        
        <button className={`${styles.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}>
          Book Session
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;