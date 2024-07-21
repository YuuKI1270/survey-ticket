<template>
  <Suspense>
    <NuxtLayout>
      <ErrorComp v-if="error" :message="error.message" />
      <!-- slide -->
      <div class="">
        <div class="flex justify-end space-x-16">
          <div class="mb-1 mr-2">
            <UButton
              icon="mynaui:cloud-download"
              variant="solid"
              color="green"
              label="Export Data"
              :loading="loading"
              @click="exportData"
            >
            </UButton>
          </div>
        </div>

        <div v-if="listTicket?.response.data.length === 0" class="cus-table">
          <div
            v-if="!isLoading"
            class="flex flex-col items-center justify-center h-screen"
          >
            <UIcon color="grey" name="mynaui:inbox-x" size="100" />
            <div class="text-grey">No Data...</div>
          </div>
        </div>
        <div v-if="isLoading" class="cus-table">
          <LoadingPage :open="isLoading" />
        </div>
        <div class="table-container">
          <div class="cus-table-wrapper">
            <table class="cus-table bg-slate-300">
              <thead>
                <tr>
                  <th
                    v-for="(_value, key) in listTicket?.response.data[0]"
                    :key="key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    scope="col"
                    :class="
                      `${key}` == 'ticket_id' ||
                      `${key}` == 'subject' ||
                      `${key}` == 'customer_name' ||
                      `${key}` == 'department' ||
                      `${key}` == 'status' ||
                      `${key}` == 'creator' ||
                      `${key}` == 'account_id' ||
                      `${key}` == 'complaint_type' ||
                      `${key}` == 'cause_of_problem' ||
                      `${key}` == 'source_of_complaint' ||
                      `${key}` == 'team_related' ||
                      `${key}` == 'subscription_plan' ||
                      `${key}` == 'last_activity' ||
                      `${key}` == 'last_replier' ||
                      `${key}` == 'create_date' ||
                      `${key}` == 'rating' ||
                      `${key}` == 'unsatisfied_technical_skill' ||
                      `${key}` == 'level' ||
                      `${key}` == 'comment1' ||
                      `${key}` == 'comment1_createby' ||
                      `${key}` == 'comment1_createdat' ||
                      `${key}` == 'comment2' ||
                      `${key}` == 'comment2_createby' ||
                      `${key}` == 'comment2_createdat' ||
                      `${key}` == 'comment3' ||
                      `${key}` == 'comment3_createby' ||
                      `${key}` == 'comment3_createdat'
                    "
                  >
                    {{ key.toString().replace(/_/g, " ") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="value in listTicket?.response.data"
                  :key="value.ticket_id"
                  @dblclick="handleRowClick(value)"
                  class="text-gray-500 hover:bg-gray-100"
                  style="cursor: pointer"
                >
                  <td
                    v-for="(item, key) in value"
                    :key="key"
                    class="px-6 py-2.5 whitespace-nowrap"
                  >
                    <a
                      v-if="`${key}` == 'ticket_id'"
                      :id="value.ticket_id"
                      :href="`https://ticket.cogetel.com.kh/staff/index.php?/Tickets/Ticket/View/${value.ticket_id}`"
                      target="_blank"
                      class="text-indigo-600 hover:text-indigo-900"
                      >{{ item }}</a
                    >
                    <span v-if="`${key}` != 'ticket_id'"> {{ item }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="flex items-start w-full justify-end pt-1">
        <UPagination
          v-model="currentPage"
          :page-count="15"
          :max="10"
          :total="listTicket?.response.total_count || 0"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-lg min-w-[32px] justify-center',
            default: {
              activeButton: {},
            },
          }"
        />
      </div>
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import { useUser } from "~/composables/states";

// middleware
definePageMeta({
  middleware: [function (to, from) {}],
});

// State
const page = usePage();

const selectedRow = ref(null);

const loading = ref(false);

const title = ref("");

const currentPageString = page.value;

const currentPage = ref(currentPageString ? currentPageString : 1);

const header = useRequestHeaders();

const user = useUser();

const navigate = useRouter();

watch(selectedRow, (newRow) => {
  if (newRow) {
    title.value = newRow;
  }
});
// Fetch
const exportData = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/exportexcel", {
      method: "POST",
      headers: header,
      body: {
        brand_id: user.$state.user.brandid,
      },
      onResponse({ response }) {
        const data = response._data;
        const link = window.URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = link;
        tempLink.setAttribute("download", "all-quality-survey.xlsx");
        document.body.appendChild(tempLink);
        tempLink.click();
      },
    });
  } catch (error) {
    console.error("Error searching by date range:", error);
    // Handle error appropriately, e.g., show error message to the user
  } finally {
    loading.value = false; // Set loading back to false after fetching data
  }
};

const {
  data: listTicket,
  pending: isLoading,
  error,
} = await useAsyncData(
  "ticket-list",
  () =>
    $fetch("/api/ticket-list", {
      method: "POST",
      lazy: true,

      headers: header,
      body: {
        page: currentPage.value,
        size: 15,
      },

      onResponse({ request, response, options }) {
        const data = response._data;
        data.response.data.forEach((ticket: any) => {
          // Format create_date if it exists
          if (ticket.create_date) {
            ticket.create_date = moment(ticket.create_date).format(
              "DD MMMM YYYY HH:mm A"
            );
          }
          // Format last_activity if it exists
          if (ticket.last_activity) {
            ticket.last_activity = moment(ticket.last_activity).format(
              "DD MMMM YYYY HH:mm A"
            );
          }
          // Format comment1_createdat if it exists
          if (ticket.comment1_createdat) {
            ticket.comment1_createdat = moment(
              ticket.comment1_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
          // Format comment2_createdat if it exists
          if (ticket.comment2_createdat) {
            ticket.comment2_createdat = moment(
              ticket.comment2_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
          // Format comment3_createdat if it exists
          if (ticket.comment3_createdat) {
            ticket.comment3_createdat = moment(
              ticket.comment3_createdat
            ).format("DD MMMM YYYY HH:mm A");
          }
        });
      },
    }),

  {
    watch: [currentPage],
  }
);

// Methods
const handleRowClick = (row: any) => {
  navigate.push(`/tickets/${row.ticket_id}`);
};

//rows
</script>
<style scoped>
.table-container {
  max-width: 100%;
  margin: auto;
  padding: 0 20px;
}

.cus-table ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.cus-table ::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.cus-table ::-webkit-scrollbar-thumb {
  background-color: #9f9f9f6c;
  border-radius: 10px;
}
.cus-table ::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  text-align: left;
}

.table tbody tr:hover {
  background-color: rgba(79, 70, 229, 0.05);
}
.table-container {
  height: 80vh;
  overflow: auto;
  scrollbar-width: thin;
}

.cus-table-wrapper {
  width: 100%;
  scrollbar-width: thin;
}

.cus-table {
  width: max-content;
  min-width: 100%;
}
.empty-message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35vh;
}
</style>
