import Client, {createClient, createDefaultClient} from "./Client.model";

const rickAndMorty = createDefaultClient();
const spaceGhost = createClient({id: 2, name: 'Space Ghost', email: 'space@gmail.com', isActive: false})

const MOCK_CLIENTS: Client[] = [rickAndMorty, spaceGhost];

export default MOCK_CLIENTS;
