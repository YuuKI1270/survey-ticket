declare namespace ITickets {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }

  interface Response {
    data: Ticket[];
    page: number;
    limit: number;
    offset: number;
    total_pages: number;
    total_count: number;
  }

  interface Ticket {
    ticket_id: number;
    subject: string;
    customer_name: string;
    creator: string;
    last_activity: string;
    lastreplier: string;
    create_date: string;
  }
}

declare namespace ILogin {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }

  interface Response {
    username: string;
    brandid: number;
    access_token: string;
    refresh_token: string;
  }

  interface Login {
    ticket_id: number;
    subject: string;
    customer_name: string;
    creator: string;
    last_activity: string;
    lastreplier: string;
    create_date: string;
  }
}

declare namespace IRating {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }
  interface Response {
    id: number;
    value: string;
    isselected: number;
  }
}

declare namespace ILevel {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }
  interface Response {
    id: number;
    value: string;
    isselected: number;
  }
}

declare namespace ITechnical {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }
  interface Response {
    id: number;
    value: string;
  }
}

declare namespace IDepartment {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }

  interface Response {
    data: Department[];
    departmentid: number;
    title: string;
    brandid: number;
  }

  interface Department {
    ticket_id: number;
    subject: string;
    customer_name: string;
    creator: string;
    last_activity: string;
    lastreplier: string;
    create_date: string;
  }
}

declare namespace IStatus {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }

  interface Response {
    data: Status[];
    ticketstatusid: number;
    title: string;
    departmentid: number;
  }

  interface Status {
    ticket_id: number;
    subject: string;
    customer_name: string;
    creator: string;
    last_activity: string;
    lastreplier: string;
    create_date: string;
  }
}

declare namespace ITicketsStatus {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }
  interface Response {
    ticket_id: number;
    subject: string;
    customer_name: string;
    owner: string;
    lastreplier: string;
    date: string;
    rating: number;
    departmentid: number;
    ticketstatusid: number;
    level: [];
    skill: number;
    comments: [
      commentid: number,
      ticketid: number,
      description: string,
      createby: string,
      updateby: string,
      createdat: string,
      updatedat: string
    ];
  }
}

declare namespace ISurveyUpdate {
  interface RootResponse {
    status_code: number;
    message: string;
    response: Response;
  }
  interface Post {
    ticketid: number;
    rating: number;
    level: [];
    skill: number;
    creator: string;
    comments: [
      {
        ticket_id: number;
        subject: string;
        customer_name: string;
        creator: string;
        last_activity: string;
        lastreplier: string;
        create_date: string;
      }
    ];
  }
  interface Ticket {
    ticket_id: number;
    subject: string;
    customer_name: string;
    creator: string;
    last_activity: string;
    lastreplier: string;
    create_date: string;
  }
}
declare namespace IReport {
  interface IResReport {
    status_code: number;
    message: string;
    response: Response;
  }

  interface Response {
    data: T[];
    page: number;
    limit: number;
    offset: number;
    total_pages: number;
    total_count: number;
  }
}
