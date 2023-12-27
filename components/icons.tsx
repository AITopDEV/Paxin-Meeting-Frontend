import {
  LucideProps,
  Moon,
  SunMedium,
  Twitter,
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="51"
      viewBox="0 0 51 51"
      fill="none"
      {...props}
    >
      <path
        d="M18.6779 16.2382C20.1317 15.6459 21.8009 17.1267 21.424 18.6344C21.0471 20.1421 18.9471 20.842 17.8702 19.6844C16.7933 18.5267 17.2779 16.669 18.6779 16.2382Z"
        fill="#00B887"
      />
      <path
        d="M32.7585 25.0714C34.1585 24.4791 35.8277 25.7984 35.5585 27.2791C35.2893 28.7599 33.4316 29.6483 32.247 28.733C31.0624 27.8176 31.2239 25.5291 32.7585 25.0714Z"
        fill="#FFCE00"
      />
      <path
        d="M21.2352 0.322341C35.0197 -1.88596 47.9696 7.48586 50.1773 21.2743C51.685 30.6192 47.835 40.0179 40.1889 45.6195C36.7159 48.2048 32.6236 49.8206 28.3429 50.3054C15.5545 51.8943 3.62769 43.5997 0.666178 31.0501C-0.653042 25.3677 -0.00689391 19.4161 2.55078 14.1646C6.05075 6.89339 13.2392 1.53421 21.2352 0.322341ZM21.7737 2.47678C9.20072 4.38885 0.558486 16.1575 2.47001 28.734C4.38153 41.3106 16.1468 49.9553 28.7198 48.0432C41.2928 46.1312 49.935 34.3625 48.0235 21.786C47.6196 19.0391 46.7043 16.4268 45.3581 14.003C43.2581 10.2866 40.162 7.21655 36.4467 5.11597C31.9775 2.63837 26.8352 1.6958 21.7737 2.47678Z"
        fill="#111827"
      />
      <path
        d="M27.5891 20.0355C26.0814 19.1737 24.4391 18.6621 22.7699 18.1773H22.4737C22.4737 18.6082 22.4468 19.0391 22.3391 19.443C26.1352 20.251 29.2044 22.0014 31.6813 24.9907L32.7852 24.2367C31.1698 22.4054 29.7429 21.1666 27.5891 20.0355Z"
        fill="#00B887"
      />
      <path
        d="M34.1313 12.6027C27.2122 7.75516 17.6545 9.45179 12.8354 16.3729C8.01616 23.2941 9.68538 32.8544 16.6046 37.7019C19.9699 40.1526 24.1968 41.0952 28.2891 40.3142C36.5544 38.8061 42.0466 30.9154 40.5928 22.6477C39.8928 18.5543 37.5505 14.9187 34.1313 12.6027ZM37.7928 20.8165C37.0121 20.0355 36.1775 19.2814 35.3159 18.6082C35.1275 17.6656 34.8582 16.7769 34.589 15.8882C35.989 17.2886 37.0928 18.9583 37.7928 20.8165ZM22.7699 17.5848C26.0814 16.6961 29.7429 16.9115 32.8121 18.5004C33.2698 18.7967 33.889 18.9852 34.2121 19.443C34.4813 20.9511 34.2929 22.4862 34.0236 23.9673L35.1813 24.3444C35.4775 22.9978 35.5852 21.6513 35.5044 20.2779C36.6352 21.4089 37.7928 22.5939 38.4928 24.0751C38.7621 26.9836 38.0621 29.8921 36.4467 32.3427C36.2582 31.3463 35.989 30.3229 35.6929 29.3534L34.589 29.9728C34.9929 31.2117 35.289 32.4505 35.4505 33.7431C34.7236 34.4972 33.9698 35.1974 33.1621 35.8437C31.5467 35.8437 29.9314 35.5475 28.4237 34.9819C28.2352 35.332 28.0198 35.6821 27.8314 36.0591C28.9621 36.4631 30.1467 36.7593 31.3314 36.9479C26.916 39.21 21.2622 38.5906 17.4122 35.4667C19.243 35.8706 21.1276 35.9514 22.9853 35.736C22.7968 35.332 22.6622 34.955 22.5007 34.578C20.1045 34.8742 17.6815 34.5241 15.5007 33.5277C14.6123 32.639 14.02 31.454 13.4815 30.296C13.1046 29.5689 13.293 28.734 13.4277 27.9531C14.02 25.0715 15.5007 22.4592 17.6815 20.4933C17.4122 20.1971 17.1699 19.8739 16.9007 19.5507C14.8546 21.4089 13.3469 23.8058 12.5661 26.4449C12.2969 24.1289 12.7007 21.8129 13.7507 19.7392C14.693 19.3084 15.7161 19.1737 16.7122 18.9852C16.6584 18.5812 16.6315 18.1503 16.6046 17.7464L14.5315 18.2042C16.3084 15.5381 18.9738 13.5722 22.043 12.6835C21.3968 13.4914 20.7776 14.3262 20.2391 15.2149L21.3699 15.6997C22.1237 14.4339 23.0391 13.3029 24.143 12.3334C26.6737 12.0102 29.2044 12.4949 31.466 13.6529C33.0275 14.3531 33.2967 16.2921 33.9429 17.7195C30.3621 15.7266 26.1083 15.2957 22.2045 16.5076C22.393 16.8308 22.4737 17.2078 22.4737 17.5848"
        fill="#111827"
      />
      <path
        d="M17.8159 20.8165L19.0812 21.005C18.7582 25.1254 20.2389 29.1919 23.1466 32.1542C22.8774 32.4774 22.6081 32.8544 22.3658 33.2045C19.1082 29.9459 17.4389 25.4216 17.8159 20.8165Z"
        fill="#01B6D3"
      />
      <path
        d="M27.9659 32.9073C29.4198 31.965 30.6852 30.7804 31.7351 29.4342L32.8121 30.1881C31.5736 31.7496 30.1198 33.0957 28.4506 34.1727L27.9659 32.9073Z"
        fill="#FFCE00"
      />
      <path
        d="M24.3586 32.208C25.9201 31.3196 27.9124 33.1503 27.2124 34.7926C26.5124 36.4349 24.6278 36.6503 23.6586 35.4657C22.6893 34.2811 23.1201 32.7195 24.3586 32.208Z"
        fill="#01B6D3"
      />
      <path
        d="M14.1544 6.1663L16.2275 5.22373C16.4698 5.08908 16.7659 5.00829 17.0352 4.98135C17.2775 4.92749 17.5198 4.95442 17.7621 5.00829C18.0044 5.08908 18.1928 5.1968 18.3813 5.35838C18.5967 5.5469 18.7582 5.78927 18.8659 6.05858C19.1621 6.67798 19.2159 7.18966 19.0275 7.62055C18.839 8.05143 18.4352 8.3746 17.8429 8.64391L17.089 8.994L17.8698 10.7176L16.5236 11.337L14.1544 6.1663ZM16.6044 7.91678L16.8198 7.80906L17.1698 7.64748C17.2775 7.59362 17.3582 7.51282 17.439 7.43203C17.5198 7.37817 17.5736 7.27045 17.5736 7.16273C17.6005 7.00114 17.5736 6.86649 17.4929 6.73184C17.439 6.59719 17.3582 6.48946 17.2505 6.40867C17.1698 6.32788 17.0621 6.30095 16.9544 6.30095C16.8467 6.30095 16.7121 6.32788 16.6044 6.38174C16.4698 6.40867 16.3352 6.46253 16.2275 6.54332L16.0121 6.62412L16.6044 7.91678Z"
        fill="#111827"
      />
      <path
        d="M24.6277 7.99759L24.2239 8.99402L22.6624 8.94016L25.0046 3.31168L26.62 3.36554L28.5854 9.10174H27.0239L26.6739 8.07838L24.6277 7.99759ZM25.7585 5.08909L25.0854 6.89344H26.2969L25.7585 5.08909Z"
        fill="#111827"
      />
      <path
        d="M33.7002 4.90051L35.2887 5.78922V7.48584L36.7694 6.651L38.3309 7.5397L35.4771 8.94009L35.8002 12.6296L34.2656 11.7409L34.131 9.53256L32.0848 10.5021L30.5233 9.64028L33.9694 8.07831L33.7002 4.90051Z"
        fill="#111827"
      />
      <path
        d="M38.4124 15.8061L37.4971 14.6484L41.9663 11.1484L42.8816 12.3061L38.4124 15.8061Z"
        fill="#111827"
      />
      <path
        d="M45.6543 16.9654L46.0312 18.3927L43.3658 21.8937L46.7312 21.005L47.1081 22.4323L41.5889 23.9135L41.2389 22.4592L43.9043 18.9852L40.5389 19.8739L40.162 18.4466L45.6543 16.9654Z"
        fill="#111827"
      />
      <path
        d="M40.9427 29.1913L41.2389 27.7375L45.6004 28.599L45.8158 27.4144L47.0542 27.6567L46.3004 31.5067L45.0619 31.2375L45.3043 30.0529L40.9427 29.1913Z"
        fill="#111827"
      />
      <path
        d="M36.9855 36.7324L38.0355 35.2243L40.6201 35.332H40.647L38.8432 34.0662L39.6778 32.8544L44.3623 36.113L43.097 37.9442C42.9354 38.1597 42.747 38.3482 42.5585 38.5098C42.37 38.6714 42.1547 38.7791 41.9393 38.8599C41.7239 38.9137 41.4816 38.9137 41.2662 38.8868C40.997 38.8329 40.7547 38.6983 40.5124 38.5636C40.3508 38.4559 40.2162 38.3213 40.1085 38.1597C40.0008 38.025 39.8931 37.8634 39.8393 37.7019C39.7316 37.3518 39.7585 36.9747 39.9201 36.6246L36.9855 36.7324ZM41.4277 35.8706L41.347 35.9783C41.2662 36.086 41.2124 36.1938 41.1585 36.3015C41.0777 36.3823 41.0508 36.5169 41.0508 36.6246C41.0239 36.7324 41.0239 36.8401 41.0778 36.9478C41.1047 37.0555 41.2124 37.1363 41.3201 37.244C41.4277 37.3248 41.5624 37.3787 41.697 37.3787C41.8047 37.3787 41.9124 37.3518 41.9931 37.2979C42.1008 37.244 42.1816 37.1633 42.2624 37.0825L42.5047 36.8132L42.5854 36.6785L41.4277 35.8706Z"
        fill="#111827"
      />
      <path
        d="M34.2926 39.9372L34.158 38.8869L35.5311 38.1328L36.3388 44.1922L34.9388 44.9462L30.335 40.9874L31.708 40.2334L32.5157 40.9336L34.2926 39.9372ZM34.8042 43.0342L34.4811 41.176L33.4042 41.7415L34.8042 43.0342Z"
        fill="#111827"
      />
      <path
        d="M27.9391 47.1815H25.8392C25.4622 47.2084 25.0584 47.1276 24.7084 46.9929C24.3584 46.8583 24.0623 46.6698 23.793 46.4005C23.5238 46.1581 23.3084 45.8619 23.1469 45.5118C22.9853 45.1617 22.9046 44.7846 22.9046 44.4076C22.8776 44.0306 22.9584 43.6266 23.093 43.2765C23.2546 42.9264 23.443 42.6302 23.7123 42.3609C23.9815 42.0916 24.2776 41.9031 24.6276 41.7415C24.9776 41.6068 25.3546 41.526 25.7315 41.4991H27.8315L27.9391 47.1815ZM26.3776 42.7648H26.0276C25.8122 42.7648 25.5969 42.7918 25.4084 42.8726C25.2199 42.9264 25.0315 43.0342 24.8969 43.1688C24.7623 43.3035 24.6276 43.465 24.5469 43.6536C24.4661 43.8959 24.4392 44.1383 24.4392 44.3807C24.4392 44.6231 24.493 44.8385 24.5738 45.0539C24.6546 45.2425 24.7622 45.404 24.9238 45.5387C25.0584 45.6733 25.2469 45.7811 25.4353 45.8349C25.6507 45.9157 25.8661 45.9427 26.0815 45.9427H26.4315L26.3776 42.7648Z"
        fill="#111827"
      />
      <path
        d="M17.0084 44.2999L17.3853 43.4381L15.8507 42.7649L16.3623 41.6338L17.87 42.307L18.2738 41.3914L16.6584 40.6912L17.17 39.5332L20.1315 40.8259L17.87 46.0504L14.9084 44.7577L15.3931 43.6266L17.0084 44.2999Z"
        fill="#111827"
      />
      <path
        d="M5.88919 22.4323C6.1315 23.1594 6.37381 23.8865 6.58919 24.6137H8.90455L7.04688 25.9602C7.26226 26.6873 7.50457 27.4144 7.74687 28.1416L5.88919 26.795L4.03152 28.1416L4.75843 25.9602L2.90076 24.6137H5.1892C5.4315 23.8865 5.64689 23.1594 5.88919 22.4323Z"
        fill="#111827"
      />
      <path
        d="M7.10074 29.919C7.34305 30.6461 7.58535 31.3733 7.80074 32.1004H10.1161L8.25842 33.4469C8.47381 34.174 8.71611 34.9012 8.95842 35.6283L7.10074 34.2818L5.24306 35.6283L5.96998 33.4469L4.1123 32.1004H6.40075C6.64305 31.3733 6.85844 30.6461 7.10074 29.919Z"
        fill="#111827"
      />
      <path
        d="M11.9201 36.1669C12.1624 36.894 12.4047 37.6211 12.6201 38.3482H14.9085L13.0508 39.6678L13.7778 41.8492L11.9201 40.5027L10.0624 41.8492L10.7893 39.6678L8.93164 38.3482H11.2201C11.4624 37.6211 11.6778 36.894 11.9201 36.1669Z"
        fill="#111827"
      />
      <path
        d="M7.74662 14.5686C7.98892 15.2957 8.23123 16.0228 8.44661 16.7499H10.762L8.9043 18.0965C9.11968 18.8236 9.36199 19.5507 9.60429 20.2778L7.74662 18.9313L5.88894 20.2778L6.61586 18.0965L4.75818 16.7499H7.04662C7.28893 16.0228 7.53123 15.2957 7.74662 14.5686Z"
        fill="#111827"
      />
      <path
        d="M11.3546 8.32071C11.57 9.04783 11.8123 9.77496 12.0546 10.5021H14.343L12.4854 11.8486C12.7277 12.5757 12.943 13.3029 13.1853 14.03L11.3546 12.6565L9.49692 14.03C9.73922 13.3029 9.95461 12.5757 10.1969 11.8486L8.33923 10.5021H10.6277L11.3546 8.32071Z"
        fill="#111827"
      />
    </svg>
  ),
}
