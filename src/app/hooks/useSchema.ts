// @ts-expect-error - Circular reference
export type SchemaFieldType =
  | 'uuid'
  | 'uuid[]'
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'boolean'
  | 'boolean[]'
  | 'date'
  | 'date[]'
  | SchemaFieldType
  | SchemaFieldType[];

export type Schema = Record<string, SchemaFieldType>;

export interface SchemaExample {
  name: string;
  schema: Schema;
}
const schemaExamples: SchemaExample[] = [
  {
    name: 'E-commerce Order',
    schema: {
      orderId: 'uuid',
      orderDate: 'string',
      customerInfo: {
        id: 'string',
        name: 'string',
        shippingAddress: {
          street: 'string',
          city: 'string',
          zipCode: 'string',
          country: 'string',
        },
        billingAddress: {
          street: 'string',
          city: 'string',
          zipCode: 'string',
          country: 'string',
        },
      },
      items: [
        {
          productId: 'string',
          productName: 'string',
          quantity: 'number',
          unitPrice: 'number',
        },
      ],
      totalAmount: 'number',
      paymentMethod: 'string',
      shippingDetails: {
        carrier: 'string',
        trackingNumber: 'string',
        estimatedDelivery: 'string',
      },
      orderStatus: 'string',
      customerNotes: 'string',
    },
  },
  {
    name: 'Online Course',
    schema: {
      id: 'uuid',
      courseName: 'string',
      instructor: 'string',
      description: 'string',
      modules: [
        {
          id: 'string',
          name: 'string',
          lessons: [
            {
              id: 'string',
              title: 'string',
              content: 'string',
              isCompleted: 'boolean',
            },
          ],
        },
      ],
      startDate: 'string',
      endDate: 'string',
      enrollmentCount: 'number',
      rating: 'number',
      reviews: 'string[]',
      isPublished: 'boolean',
      price: 'number',
      tags: 'string[]',
    },
  },
  {
    name: 'Library Book',
    schema: {
      id: 'number',
      title: 'string',
      author: 'string',
      genre: 'string[]',
      publicationYear: 'number',
      isbn: 'string',
      isAvailable: 'boolean',
      borrowerInfo: {
        id: 'string',
        name: 'string',
        borrowDate: 'date',
        returnDate: 'date',
      },
      pageCount: 'number',
      keywords: 'string[]',
      coverImageUrl: 'string',
      rating: 'number',
      reviews: 'string[]',
    },
  },
  {
    name: 'Hotel Room',
    schema: {
      id: 'number',
      roomType: 'string',
      amenities: 'string[]',
      capacity: 'number',
      isAvailable: 'boolean',
      pricePerNight: 'number',
      view: 'string',
      bedType: 'string',
      roomSizeSqFt: 'number',
      images: 'string[]',
      guestReviews: 'string[]',
      rating: 'number',
      bookingInfo: {
        guestName: 'string',
        checkInDate: 'string',
        checkOutDate: 'string',
        numberOfGuests: 'number',
      },
    },
  },
  {
    name: 'Fitness Workout',
    schema: {
      id: 'string',
      name: 'string',
      type: 'string',
      durationMinutes: 'number',
      exercises: [
        {
          exerciseName: 'string',
          sets: 'number',
          reps: 'number',
          restTimeSeconds: 'number',
        },
      ],
      equipmentNeeded: 'string[]',
      difficultyLevel: 'string',
      caloriesBurnedEstimate: 'number',
      muscleGroupsTargeted: 'string[]',
      workoutDescription: 'string',
      trainerNotes: 'string',
      rating: 'number',
      reviews: 'string[]',
    },
  },
  {
    name: 'Music Album',
    schema: {
      id: 'string',
      title: 'string',
      artistName: 'string',
      genre: 'string[]',
      releaseYear: 'number',
      tracks: [
        {
          trackId: 'string',
          trackTitle: 'string',
          durationSeconds: 'number',
          isExplicit: 'boolean',
        },
      ],
      label: 'string',
      coverImageUrl: 'string',
      rating: 'number',
      reviews: 'string[]',
      awards: 'string[]',
    },
  },
  {
    name: 'Real Estate Listing',
    schema: {
      id: 'uuid',
      listingId: 'string',
      propertyType: 'string',
      address: 'string',
      city: 'string',
      state: 'string',
      zipCode: 'string',
      price: 'number',
      bedrooms: 'number',
      bathrooms: 'number',
      squareFootage: 'number',
      lotSizeAcres: 'number',
      yearBuilt: 'number',
      description: 'string',
      amenities: 'string[]',
      images: 'string[]',
      agentInfo: {
        name: 'string',
        phone: 'string',
        email: 'string',
      },
    },
  },
  {
    name: 'Social Media Post',
    schema: {
      id: 'uuid',
      postStumb: 'string',
      authorName: 'string',
      authorUsername: 'string',
      postDate: 'string',
      postContent: 'string',
      likes: 'number',
      comments: [
        {
          id: 'string',
          author: 'string',
          content: 'string',
          date: 'date',
        },
      ],
      shares: 'number',
      tags: 'string[]',
      imageUrl: 'string',
      videoUrl: 'string',
    },
  },
];

export type SchemaExampleName = (typeof schemaExamples)[number]['name'];

export const useSchemaExamples = () => {
  const getExampleNames = () => schemaExamples.map(example => example.name);

  const getExampleByName = (name: SchemaExampleName) => {
    return schemaExamples.find(example => example.name === name);
  };

  return {
    examples: schemaExamples,
    getExampleNames,
    getExampleByName,
  };
};
