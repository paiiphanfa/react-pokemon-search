import { Container, CssBaseline, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import PokemonLogo from "../image/pokemon-logo.png";

const GET_POKEMON = gql`
  query pokemon($name: String) {
    pokemon(name: $name) {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
    }
  }
`;

const GET_POKEMON_ATK = gql`
    query pokemon($id: String, $name: String){
        pokemon(id: $id, name: $name){
          id
          name
          attacks{
            fast{
              name
              type
              damage
            }
            special{
              name
              type
              damage
            }
          }
        }
      }
`;

const GET_POKEMON_EVO = gql`
    query pokemon($id: String, $name: String){
        pokemon(id: $id, name: $name){
          id
          name
          evolutions{
            id
            number
            name
            classification
            types
            resistant
            weaknesses
            fleeRate
            maxCP
            maxHP
            image
          }
        }
      }
`;


const Home = () => {
  const [search, setSearch] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [getPokemon, { loading, data }] = useLazyQuery(GET_POKEMON);
  const [getPokemonAtk, atkData] = useLazyQuery(GET_POKEMON_ATK);
  const [getPokemonEvo, evoData] = useLazyQuery(GET_POKEMON_EVO);

  const handleSearch = () => {
    setSearchPerformed(true);
    const variables = { name: search };
    getPokemon({ variables });
    getPokemonAtk({ variables });
    getPokemonEvo({ variables });
  };

  const handleEvolutionClick = (evolutionName: any) => {
    const variables = { name: evolutionName };
    getPokemon({ variables });
    getPokemonAtk({ variables });
    getPokemonEvo({ variables });
  };

  interface EvolutionNameProps {
    name: string;
    onEvolutionClick: (name: string) => void;
  }

  const EvolutionName: React.FC<EvolutionNameProps> = ({ name, onEvolutionClick }) => (
    <Typography
      key={name}
      sx={{ marginTop: 2, cursor: 'pointer' }}
      onClick={() => onEvolutionClick(name)}
    >
      Name: <span style={{ color: 'blue' }}>{name}</span>
    </Typography>
  );
  
  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={PokemonLogo}
            alt="Pokemon Logo"
            style={{ width: 500, height: 200, margin: 50 }}
          />
          <Typography variant="h4" fontStyle={"italic"}>Pokemon Search</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="search"
              label="Pokemon name"
              name="search"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Container>
                
            {loading && (
            <Box sx={{ mt: 3 }}>
              <Typography align="center">Loading...</Typography>
            </Box>
          )}

          {data && data.pokemon && (
            <Box sx={{ mt: 3, display: "flex", gap: 4, justifyContent: "center"}}>
              <img src={data.pokemon.image} alt={data.pokemon.name} style={{ width: 100, height: 100, marginRight: 20 }} />
              <Box>
                <Typography variant="h5" fontStyle={"italic"}>Pokemon Details:</Typography>
                <Typography>Name: {data.pokemon.name}</Typography>
                <Typography>Number: {data.pokemon.number}</Typography>
                <Typography>Classification: {data.pokemon.classification}</Typography>
              </Box>
              <Box sx={{ marginLeft: 4 }}>
                <Typography variant="h5" fontStyle="italic">
                  Attack Line:
                </Typography>
                <Typography sx={{ marginTop: 2 }}>Fast Attack:</Typography>
                <Typography> {
                    atkData.data && atkData.data.pokemon && atkData.data.pokemon.attacks &&
                    atkData.data.pokemon.attacks.fast.map((attack: any) => (
                    <li key={attack.name}>
                      {attack.name} - Type: {attack.type}, Damage: {attack.damage}
                    </li>
                    ))}</Typography>
                <Typography sx={{ marginTop: 2 }}>Special Attack:</Typography>
                <Typography> {
                    atkData.data && atkData.data.pokemon && atkData.data.pokemon.attacks &&
                    atkData.data.pokemon.attacks.special.map((attack: any) => (
                    <li key={attack.name}>
                      {attack.name} - Type: {attack.type}, Damage: {attack.damage}
                    </li>
                    ))}</Typography>
              </Box>
              <Box sx={{ display: 'flex'}}>
              <Typography variant="h5" fontStyle="italic">
                Evolution Line:
              </Typography>
              {evoData.data &&
                evoData.data.pokemon &&
                evoData.data.pokemon.evolutions &&
                evoData.data.pokemon.evolutions.map((evolution: any, index: any) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: index !== 0 ? 2 : 0 }}>
                    <img
                      src={evolution.image}
                      alt={evolution.name}
                      style={{ width: 100, height: 100, marginRight: 20 }}
                    />
                    <EvolutionName name={evolution.name} onEvolutionClick={handleEvolutionClick} />
                    <Typography>Number: {evolution.number}</Typography>
                    <Typography>Classification: {evolution.classification}</Typography>
                  </Box>
                ))}
                </Box>
            </Box>
            
          )}

          {searchPerformed && !loading && !data?.pokemon && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center"}}>
              <Typography variant="h5">Pokemon Not Found</Typography>
            </Box>
          )}
      <Container>

      </Container>
    </>
  );
};

export default Home