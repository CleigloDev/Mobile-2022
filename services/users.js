export const fetchUsersPage = async (page) => {
    const res = await fetch(`https://mz37bp4toc.execute-api.eu-west-1.amazonaws.com/challenge/users?page=${page}`);
    
    if(res.status === 500) throw "Errore richiesta utenti";
    
    const json = await res.json();
    return json;
}
