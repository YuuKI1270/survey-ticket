
interface User {
  username: string;
  brandid: number;
  
}
interface ITicket {
  rating: number;
  creator: string;
  level: [];
  skill: number;
  comment: [
    {
      commentid: null;
      ticketid: number;
      description: string;
      createby: string;
      updateby: string;
      createdat: string;
      updatetime: string;
    }
  ];
}
 
export const useUser = defineStore("user",  {
  state:() => ({
    user: {} as User
  }
  ),
  persist: true
})
export const useAuthStore = () => useState("authenticated", () => false);

export const useTicketstore = defineStore ('ticket',  {
    state:() => ({
        ticketstore: {} as ITicket
}
),
})

export const usePage= ()=> useState('page',)