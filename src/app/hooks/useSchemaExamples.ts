import type { Field } from './useSchemaFields';

type SchemaExample = {
  name: string;
  fields: Field[];
};

const schemaExamples: SchemaExample[] = [
  {
    name: 'Blog Post',
    fields: [
      { id: 'title', type: 'string', example: 'The Future of AI' },
      {
        id: 'description',
        type: 'string',
        example: 'An in-depth look at artificial intelligence trends',
      },
      { id: 'content', type: 'string', example: 'In recent years, artificial intelligence has...' },
      { id: 'tags', type: 'string[]', example: ['AI', 'Technology', 'Future'] },
      { id: 'categories', type: 'string[]', example: ['Technology', 'Science'] },
      { id: 'isPublished', type: 'boolean', example: true },
      { id: 'readTimeMinutes', type: 'number', example: 5 },
    ],
  },
  {
    name: 'Product',
    fields: [
      { id: 'name', type: 'string', example: 'Wireless Headphones' },
      { id: 'price', type: 'number', example: 99.99 },
      {
        id: 'description',
        type: 'string',
        example: 'High-quality wireless headphones with noise cancellation',
      },
      {
        id: 'features',
        type: 'string[]',
        example: ['Noise Cancellation', 'Bluetooth 5.0', '30h Battery Life'],
      },
      { id: 'colors', type: 'string[]', example: ['Black', 'White', 'Blue'] },
      { id: 'inStock', type: 'boolean', example: true },
      { id: 'ratings', type: 'number[]', example: [4.5, 4.8, 4.2, 4.7] },
      { id: 'reviews', type: 'string[]', example: ['Nice!', 'Ok', 'Bad :('] },
    ],
  },
  {
    name: 'Recipe',
    fields: [
      { id: 'name', type: 'string', example: 'Chocolate Chip Cookies' },
      { id: 'prepTime', type: 'number', example: 15 },
      { id: 'cookTime', type: 'number', example: 12 },
      {
        id: 'ingredients',
        type: 'string[]',
        example: ['Flour', 'Sugar', 'Butter', 'Chocolate Chips'],
      },
      {
        id: 'instructions',
        type: 'string[]',
        example: [
          '1. Preheat oven to 350°F...',
          '2. Mix ingredients...',
          '3. Bake for 12 minutes...',
        ],
      },
      { id: 'isVegetarian', type: 'boolean', example: true },
      { id: 'servings', type: 'number', example: 24 },
      { id: 'tags', type: 'string[]', example: ['Dessert', 'Baking', 'Cookies'] },
    ],
  },
  {
    name: 'User Profile',
    fields: [
      { id: 'username', type: 'string', example: 'johndoe123' },
      { id: 'fullName', type: 'string', example: 'John Doe' },
      { id: 'email', type: 'string', example: 'john.doe@example.com' },
      { id: 'age', type: 'number', example: 28 },
      {
        id: 'bio',
        type: 'string',
        example: 'Software developer passionate about AI and web technologies',
      },
      {
        id: 'interests',
        type: 'string[]',
        example: ['Programming', 'AI', 'Photography', 'Travel'],
      },
      {
        id: 'socialLinks',
        type: 'string[]',
        example: ['https://twitter.com/johndoe', 'https://github.com/johndoe'],
      },
      { id: 'isVerified', type: 'boolean', example: true },
      { id: 'memberSince', type: 'string', example: '2023-01-15' },
    ],
  },
  {
    name: 'Event',
    fields: [
      { id: 'title', type: 'string', example: 'Tech Conference 2024' },
      {
        id: 'description',
        type: 'string',
        example: 'Annual technology conference featuring industry leaders',
      },
      { id: 'startDate', type: 'string', example: '2024-06-15T09:00:00Z' },
      { id: 'endDate', type: 'string', example: '2024-06-17T18:00:00Z' },
      { id: 'location', type: 'string', example: 'San Francisco Convention Center' },
      { id: 'ticketPrice', type: 'number', example: 299.99 },
      { id: 'speakers', type: 'string[]', example: ['Jane Smith', 'Mike Johnson', 'Sarah Lee'] },
      {
        id: 'topics',
        type: 'string[]',
        example: ['AI', 'Blockchain', 'Cloud Computing', 'DevOps'],
      },
      { id: 'isVirtual', type: 'boolean', example: false },
      { id: 'maxAttendees', type: 'number', example: 1000 },
    ],
  },
  {
    name: 'Movie',
    fields: [
      { id: 'title', type: 'string', example: 'The Digital Revolution' },
      { id: 'director', type: 'string', example: 'Sarah Anderson' },
      { id: 'releaseYear', type: 'number', example: 2024 },
      { id: 'duration', type: 'number', example: 142 },
      {
        id: 'plot',
        type: 'string',
        example: 'A thrilling journey through the evolution of technology...',
      },
      { id: 'genres', type: 'string[]', example: ['Sci-Fi', 'Drama', 'Documentary'] },
      { id: 'cast', type: 'string[]', example: ['John Smith', 'Emma Davis', 'Michael Chang'] },
      { id: 'ratings', type: 'number[]', example: [8.5, 9.0, 8.8, 8.7] },
      { id: 'isReleased', type: 'boolean', example: true },
      { id: 'languages', type: 'string[]', example: ['English', 'Spanish', 'French'] },
    ],
  },
  {
    name: 'Job Posting',
    fields: [
      { id: 'title', type: 'string', example: 'Senior Full Stack Developer' },
      { id: 'company', type: 'string', example: 'TechCorp Solutions' },
      { id: 'location', type: 'string', example: 'New York, NY (Hybrid)' },
      {
        id: 'description',
        type: 'string',
        example: 'We are seeking an experienced Full Stack Developer...',
      },
      {
        id: 'requirements',
        type: 'string[]',
        example: ['5+ years experience', 'React', 'Node.js', 'AWS'],
      },
      {
        id: 'benefits',
        type: 'string[]',
        example: ['Health Insurance', '401k', 'Remote Work Options'],
      },
      { id: 'salaryRange', type: 'string', example: '$120,000 - $160,000' },
      { id: 'employmentType', type: 'string', example: 'Full-time' },
      { id: 'isRemote', type: 'boolean', example: true },
      { id: 'experienceYears', type: 'number', example: 5 },
    ],
  },
  {
    name: 'Restaurant',
    fields: [
      { id: 'name', type: 'string', example: 'The Golden Spoon' },
      { id: 'cuisine', type: 'string', example: 'Italian' },
      {
        id: 'description',
        type: 'string',
        example: 'Authentic Italian cuisine in a cozy atmosphere',
      },
      { id: 'address', type: 'string', example: '123 Main St, New York, NY 10001' },
      {
        id: 'openingHours',
        type: 'string[]',
        example: ['Mon-Fri: 11:00-22:00', 'Sat-Sun: 12:00-23:00'],
      },
      { id: 'menu', type: 'string[]', example: ['Pizza', 'Pasta', 'Salads', 'Desserts'] },
      { id: 'priceRange', type: 'string', example: '$$' },
      { id: 'rating', type: 'number', example: 4.8 },
      { id: 'acceptsReservations', type: 'boolean', example: true },
      { id: 'deliveryOptions', type: 'string[]', example: ['Dine-in', 'Takeout', 'Delivery'] },
      {
        id: 'popularDishes',
        type: 'string[]',
        example: ['Margherita Pizza', 'Fettuccine Alfredo'],
      },
    ],
  },
];

export const useSchemaExamples = () => {
  const getExampleNames = () => schemaExamples.map(example => example.name);

  const getExampleByName = (name: string) => {
    return schemaExamples.find(example => example.name === name)?.fields || [];
  };

  return {
    examples: schemaExamples,
    getExampleNames,
    getExampleByName,
  };
};
