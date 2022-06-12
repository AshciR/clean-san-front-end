interface Client {
  id: number;
  name: string;
  email: string;
  isActive: boolean
}

const createClient = ({id, name, email, isActive = true}: Client): Client => ({
  id: id,
  name: name,
  email: email,
  isActive: isActive
});

const createDefaultClient = (): Client => createClient({
  id: 1,
  name: 'Rick & Morty Adventures',
  email: 'rickandmorty@adultswim.com',
  isActive: true
});

export default Client;
export {createClient, createDefaultClient};