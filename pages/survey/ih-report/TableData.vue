<template>
  <Suspense>
    <NuxtLayout :name="layout">
      <!-- <ErrorComp v-if="error" :message="error.message" /> -->
      <!-- slide -->

      <div v-if="data?.response.data.length === 0" class="cus-table">
        <div
          v-if="!loading"
          class="flex flex-col items-center justify-center h-screen"
        >
          <UIcon color="grey" name="mynaui:inbox-x" size="100" />
          <div class="text-grey">No Data...</div>
        </div>
      </div>
      <div v-if="loading" class="cus-table">
        <LoadingPage :open="loading" />
      </div>

      <div class="table-container">
        <div class="cus-table-wrapper">
          <table class="cus-table bg-slate-300">
            <thead>
              <tr>
                <th
                  v-for="(_value, key) in data?.response.data[0]"
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
                v-for="value in data?.response.data"
                :key="value.ticket_id"
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
    </NuxtLayout>
  </Suspense>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoadingPage from "../../../components/LoadingPage.vue";
// middleware
definePageMeta({
  middleware: [function (to, from) {}],
});

// State

const layout = "custom";

const page = usePage();

const selectedRow = ref(null);

const title = ref("");

const currentPageString = page.value;

const currentPage = ref(currentPageString ? currentPageString : 1);

watch(selectedRow, (newRow) => {
  if (newRow) {
    title.value = newRow;
  }
});
const { data } = defineProps<{
  data?: IReport.IResReport;
  loading: boolean;
}>();

// Methods
onMounted(() => {
  if (process.client) {
    const currentPageString = localStorage.getItem("currentPage");
    currentPage.value = currentPageString ? parseInt(currentPageString) : 1;
  }
});
watch(currentPage, () => {
  if (process.client) {
    localStorage.setItem("currentPage", currentPage.value.toString());
  }
});

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
  max-width: 100%;
  margin: auto;
  padding: 0 20px;
  height: 80vh;
  overflow: auto;
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
  overflow: hidden;
}
</style>
