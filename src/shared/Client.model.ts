interface Client {
    id: number;
    name: string;
    email: string;
};

const createClient = ({ id, name, email }: Client): Client => ({
    id: id,
    name: name,
    email: email
});

const createDefaultClient = (): Client => createClient({
    id: 1,
    name: 'Rick & Morty Adventures',
    email: 'rickandmorty@adultswim.com'
});

export default Client;
export { createClient, createDefaultClient };