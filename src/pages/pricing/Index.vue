<template>
  <div class="pricing-container bg-gray-900 min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4"
        >
          The Cost of Content Creation
        </h1>
        <p class="text-xl text-gray-400 max-w-3xl mx-auto">
          See how Voirax Studio completely revolutionizes the economics of video production.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        <!-- Traditional Approach -->
        <div
          class="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl relative overflow-hidden flex flex-col"
        >
          <div class="absolute top-0 right-0 p-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
              Legacy
            </span>
          </div>
          <h2 class="text-2xl font-bold mb-2">Traditional Video Production</h2>
          <p class="text-gray-400 mb-8">The old way of creating a single 1-minute video.</p>

          <div class="space-y-6 flex-grow">
            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-gray-200">Scriptwriting</h3>
                <p class="text-sm text-gray-500">Copywriter or Agency</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-300">$50 - $500</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-gray-200">Voiceover</h3>
                <p class="text-sm text-gray-500">Professional Voice Actor</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-300">$100 - $300</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-gray-200">Visuals & Animation</h3>
                <p class="text-sm text-gray-500">Videographer / Stock / Animator</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-300">$200 - $1,000+</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-gray-200">Video Editing</h3>
                <p class="text-sm text-gray-500">Professional Editor (per hour)</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-300">$100 - $500</span>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-600">
            <div class="flex justify-between items-end mb-2">
              <span class="text-lg font-medium text-gray-400">Total Cost Estimate</span>
              <span class="text-3xl font-extrabold text-white">$450 - $2,300+</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Turnaround Time</span>
              <span class="text-sm font-semibold text-red-400">3 to 14 Days</span>
            </div>
          </div>
        </div>

        <!-- Voirax Studio Approach -->
        <div
          class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-emerald-500 shadow-2xl relative overflow-hidden flex flex-col transform md:-translate-y-4"
        >
          <div class="absolute inset-0 bg-emerald-500 opacity-5"></div>
          <div class="absolute top-0 right-0 p-4">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white shadow-lg animate-pulse"
            >
              Voirax Studio
            </span>
          </div>

          <h2 class="text-2xl font-bold mb-2 text-white">The AI Content Pipeline</h2>
          <p class="text-emerald-300 mb-8">Creating the exact same 1-minute video with our tools.</p>

          <div class="space-y-6 flex-grow relative z-10">
            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-emerald-100">AI Scripting</h3>
                <p class="text-sm text-gray-400">Powered by Gemini / Claude</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-emerald-400">~$0.01</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-emerald-100">AI Audio Generation</h3>
                <p class="text-sm text-gray-400">Powered by Suno / ElevenLabs</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-emerald-400">~$0.20</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-emerald-100">AI Visuals Generation</h3>
                <p class="text-sm text-gray-400">Nano Banana / Seedance / Luma</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-emerald-400">~$0.50 - $1.00</span>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-gray-700 pb-4">
              <div>
                <h3 class="font-semibold text-emerald-100">Automated Pipeline Editor</h3>
                <p class="text-sm text-gray-400">Zero human intervention required</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-emerald-400">Free</span>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-emerald-800 relative z-10">
            <div class="flex justify-between items-end mb-2">
              <span class="text-lg font-medium text-emerald-200">Total API Cost</span>
              <span
                class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300"
                >&lt; $2.00</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-400">Turnaround Time</span>
              <span class="text-sm font-bold text-emerald-400">~5 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Building it section -->
      <div class="mt-20 bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl">
        <h2 class="text-3xl font-bold mb-6 text-center text-white">How much would it cost to build this platform?</h2>
        <p class="text-center text-gray-400 mb-10 max-w-3xl mx-auto">
          Building a robust, scalable AI Content Studio like Voirax from scratch requires significant engineering
          resources, spanning frontend UI/UX, complex backend integrations, state management, and cloud architecture.
        </p>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div class="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4 text-blue-400">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Frontend & UI/UX</h3>
            <p class="text-gray-400 text-sm mb-4">
              Vue 3, responsive UI, 4-step sequential pipeline logic, global state management, and real-time previews.
            </p>
            <div class="text-blue-400 font-bold">$15,000 - $25,000</div>
          </div>

          <div class="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div class="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4 text-purple-400">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Backend & AI Integrations</h3>
            <p class="text-gray-400 text-sm mb-4">
              API integrations with Gemini, Claude, Suno, Luma, billing/token systems, and asynchronous task queues.
            </p>
            <div class="text-purple-400 font-bold">$15,000 - $30,000</div>
          </div>

          <div class="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div class="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center mb-4 text-orange-400">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">DevOps & Cloud</h3>
            <p class="text-gray-400 text-sm mb-4">
              Firebase setup, automated deployments, database security rules, CDN, and high-availability architecture.
            </p>
            <div class="text-orange-400 font-bold">$5,000 - $10,000</div>
          </div>
        </div>

        <div
          class="mt-10 p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl border border-gray-700 flex flex-col md:flex-row items-center justify-between"
        >
          <div>
            <h3 class="text-2xl font-bold text-white mb-1">Total Development Cost</h3>
            <p class="text-gray-400">Estimated timeline: 3-6 months with a team of 3-5 engineers.</p>
          </div>
          <div class="mt-4 md:mt-0 text-right">
            <div
              class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            >
              $35k - $65k+
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <router-link
          to="/studio"
          class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-1"
        >
          Start Creating with Voirax Studio Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PricingIndex'
});
</script>

<style scoped>
.pricing-container {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
