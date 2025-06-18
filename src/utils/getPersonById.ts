import { createDeliveryClient } from '@kontent-ai/delivery-sdk';
import type { Person } from '../models/content-types/person';

const projectId = 'c1ad4901-f748-000b-2b83-2c4fa51e2983';
export const deliveryClient = createDeliveryClient({
  environmentId: projectId,
});

export async function getPersonById(id: string): Promise<Person | null> {
  const response = await deliveryClient.items<Person>()
    .type('person')
    .toPromise();
  return response.data.items.find(person => person.system.id === id) || null;
}
