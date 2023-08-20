interface Client {
  id: number;
  name: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  telephoneNumber?: string;
  email?: string;
  isActive: boolean
}

const createClient = ({
                        id,
                        name,
                        primaryContactFirstName,
                        primaryContactLastName,
                        telephoneNumber,
                        email,
                        isActive = true
                      }: Client): Client => ({
  id: id,
  name: name,
  primaryContactFirstName: primaryContactFirstName,
  primaryContactLastName: primaryContactLastName,
  telephoneNumber: telephoneNumber,
  email: email,
  isActive: isActive
});

const createDefaultClient = (): Client => createClient({
  id: 1,
  name: 'Rick & Morty Adventures',
  primaryContactFirstName: 'Rick',
  primaryContactLastName: 'Sanchez',
  telephoneNumber: '8764447777',
  email: 'rickandmorty@adultswim.com',
  isActive: true
});

export default Client;
export {createClient, createDefaultClient};