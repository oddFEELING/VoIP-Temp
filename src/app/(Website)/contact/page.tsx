"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Mail,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutateMessage } from "@/hooks/use-message";
import useUser from "@/hooks/use-user";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

// ~ ======= Animation variants ======= ~
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.6,
      stiffness: 100,
      damping: 15,
    },
  },
};

// ~ ======= Contact methods data ======= ~
const contactMethods = [
  {
    title: "Phone Support",
    description: "Speak directly with our support team",
    icon: PhoneCall,
    action: "Call now",
    detail: "24/7 Support Available",
  },
  {
    title: "Email Us",
    description: "Send us your queries anytime",
    icon: Mail,
    action: "Send email",
    detail: "Quick Response Time",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageSquare,
    action: "Start chat",
    detail: "Available during business hours",
  },
];

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  topic: z.enum(["Support", "Sales", "Enquiry", "Other"]),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

// ~ =============================================>
// ~ ======= Component Start  -->
// ~ =============================================>
const ContactUsPage = () => {
  const { sendMessage, isCreatingMessage } = useMutateMessage();
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      topic: "Support",
      message: "",
    },
  });

  // ~ ======= Submit handler ======= ~
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (user) {
      sendMessage({
        senderId: user?.id,
        senderFirstName: data.firstName,
        senderLastName: data.lastName,
        senderEmail: data.email,
        content: data.message,
        topic: data.topic,
      });

      form.reset();
    } else {
      toast.error("Error", {
        description: "Failed to send message, please refresh and try again",
      });
    }
  };

  const faqs = [
    {
      question: "What is VoIP?",
      answer:
        "Voice over Internet Protocol is a convenient, affordable means for businesses and individuals to use the internet to conduct telephone calls, and represents a more cost-effective alternative to traditional PSTN.",
    },
    {
      question: "What is PBXware?",
      answer:
        "Incorporating a range of traditional telephony and modern VoIP technologies, PBXware is a scalable solution that enables enhanced management of business telecommunications. From routing and voicemail, to auto attendants and conferencing, PBXware can offer advanced features in a single package, saving you money on multiple systems.",
    },
    {
      question: "How do I set up VoIP?",
      answer:
        "You need Broadband internet connection. The more call volume you have the higher the bandwidth you will need. We have low call volume and are using a 7Mbps/700Kbps connection, this has been plenty of bandwidth for us. Wired Ethernet router. You have a ton of options here but your budget will likely decide this one.",
    },
    {
      question: "How secure is VoIP?",
      answer:
        "Security for VoIP uses industry standard encryption technology such as SSL and VPN.",
    },
    {
      question: "Can I use VoIP with a regular(analogue) telephone?",
      answer:
        "To connect VoIP phones to traditional telephony networks, you need to install an Analog Telephone Adapter (ATA) which converts the analog signal into digital data.",
    },
    {
      question: "Does VoIP work on dial-up?",
      answer:
        "A dial-up connection can support VoIP, but it is recommended to use broadband since certain codecs require higher bandwidths for quality purposes.",
    },
    {
      question:
        "What are the benefits of using LinkOrg Networks' VoIP solutions over traditional phone lines?",
      answer:
        "Our VoIP solutions offer greater flexibility, lower costs, and advanced features like call forwarding, video conferencing, and multi-device integration. It's an efficient alternative to traditional phone systems.",
    },
    {
      question:
        "Can your VoIP services be integrated with our existing IT infrastructure?",
      answer:
        "Yes, our VoIP solutions are designed to seamlessly integrate with your existing IT and network infrastructure, minimizing disruptions during deployment.",
    },
    {
      question: "How scalable are your VoIP systems for growing businesses?",
      answer:
        "Our VoIP systems are highly scalable, allowing you to easily add new users, extensions, and features as your business expands.",
    },
    {
      question: "Do you offer call encryption for secure voice communication?",
      answer:
        "Yes, all VoIP communications are encrypted end-to-end to ensure your voice communications remain private and secure from unauthorized access.",
    },
    {
      question:
        "Are your VoIP solutions suitable for remote workers or teams across multiple locations?",
      answer:
        "Yes, our VoIP solutions are perfect for remote teams and businesses with multiple locations. We provide seamless communication across all locations, no matter where your team is.",
    },
    {
      question: "What is DID?",
      answer:
        "A Direct Inward Dialing (DID) is a telephone number that is used to make and receive calls directly through a VoIP system. It allows businesses to have a single number that can be used to receive calls from anywhere, regardless of the location of the caller.",
    },
    {
      question: "What are SIP phones?",
      answer:
        "SIP phones are devices that allow you to make and receive VoIP calls using a traditional phone system. They are designed to work with VoIP systems and can be used to make and receive calls from anywhere with an internet connection.",
    },
    {
      question: "What is Business SIP Trunking?",
      answer:
        "Business SIP trunking is a service that enables your company to operate a selection of telecommunications systems over your IP network, and offers a number of benefits. From cheaper international call costs to improved business flexibility, a Disaster Recovery strategy to give access to an increased quantity of numbers, business SIP trunking from LinkOrg can enhance the way your business stays connected.",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background px-4 md:px-8">
      {/* ~ ======= Background Pattern ======= ~ */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <GridPattern
          width={80}
          height={80}
          x={-1}
          y={-1}
          strokeDasharray="4 4"
          className="absolute inset-0 h-full w-full fill-neutral-50 stroke-neutral-900/[0.1] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)] dark:stroke-neutral-100/[0.1]"
        />
      </div>

      {/* ####################################### */}
      {/* -- Hero Section -- */}
      {/* ####################################### */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto flex h-max w-full max-w-7xl flex-col items-center justify-center gap-16 py-32"
      >
        {/* ~ ======= Header Content ======= ~ */}
        <motion.div variants={itemVariants} className="text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary dark:text-accent">
            Contact Us
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary dark:text-secondary sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            We&apos;re here to assist you with any questions or queries you may
            have. Choose your preferred way to connect with our support team.
          </p>
        </motion.div>

        {/* ~ ======= Contact Methods Grid ======= ~ */}
        <motion.div
          variants={itemVariants}
          className="grid w-full grid-cols-1 gap-6 md:grid-cols-3"
        >
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border p-6 transition-all hover:border-primary/40 hover:shadow-md dark:border-muted-foreground/20 dark:hover:border-secondary/40"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary transition-colors dark:bg-secondary/10 dark:text-secondary dark:group-hover:bg-secondary/20">
                    <method.icon size={18} strokeWidth={1.2} />
                  </div>
                  <h3 className="text-xl font-semibold">{method.title}</h3>
                </div>

                <p className="text-muted-foreground">{method.description}</p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{method.detail}</span>
                  </div>

                  <Button
                    variant="link"
                    className="group/btn p-0 text-primary hover:no-underline dark:text-secondary"
                  >
                    {method.action}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </motion.header>

      {/* ####################################### */}
      {/* -- Contact Form Section -- */}
      {/* ####################################### */}
      <section className="container mx-auto w-full max-w-7xl px-4 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* ~ ======= Content Column ======= ~ */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <p className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary dark:text-accent">
                  We are
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-secondary">
                  Ready to Transform Your Communication?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Whether you&apos;re looking to enhance your business
                  communications or need technical support, our team is here to
                  guide you through every step.
                </p>
              </div>

              {/* ~ ======= Stats ======= ~ */}
              <div className="grid grid-cols-2 gap-4 py-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-primary dark:text-secondary">
                    24/7
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Technical Support
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-primary dark:text-secondary">
                    15min
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Average Response Time
                  </p>
                </div>
              </div>

              {/* ~ ======= Contact Info ======= ~ */}
              <div className="space-y-4 rounded-lg bg-muted/50 p-6">
                <h3 className="font-medium">Quick Contacts</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-primary dark:text-secondary" />
                    <span>support@yourcompany.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneCall className="h-4 w-4 text-primary dark:text-secondary" />
                    <span>+1 (234) 567-8900</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-primary dark:text-secondary" />
                    <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ~ ======= Form Column ======= ~ */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <div className="h-full w-full bg-muted/30" />
            </div>

            <div className="relative space-y-8 md:p-8">
              <div>
                <h3 className="text-xl font-semibold">Send us a Message</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ~ ======= First name --> */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* ~ ======= Last name --> */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* ~ ======= Email --> */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* ~ ======= Topic --> */}
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Support">Support</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Enquiry">Enquiry</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* ~ ======= Message --> */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* ####################################### */}
      {/* -- Map Section -- */}
      {/* ####################################### */}
      {/*<motion.section*/}
      {/*  initial="hidden"*/}
      {/*  animate="visible"*/}
      {/*  variants={containerVariants}*/}
      {/*  className="container mx-auto w-full max-w-7xl py-24"*/}
      {/*>*/}
      {/*  <motion.div variants={itemVariants} className="mb-12 text-center">*/}
      {/*    <h2 className="text-3xl font-bold tracking-tight">*/}
      {/*      Visit Our Office*/}
      {/*    </h2>*/}
      {/*    <p className="mt-4 text-muted-foreground">*/}
      {/*      Come visit our office in Nottingham, UK*/}
      {/*    </p>*/}
      {/*  </motion.div>*/}

      {/*  <div className="grid gap-8 lg:grid-cols-[1fr_400px]">*/}
      {/*    /!* ~ ======= Map Container ======= ~ *!/*/}
      {/*    <motion.div*/}
      {/*      variants={itemVariants}*/}
      {/*      className="relative h-[400px] w-full overflow-hidden rounded-lg border border-border shadow-sm"*/}
      {/*    >*/}
      {/*      <iframe*/}
      {/*        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2403.2033794605413!2d-1.1263677874754954!3d52.962755672064446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879c15d781bb26f%3A0x84876c5727284456!2s50%20Sargent%20Gardens%2C%20Nottingham%20NG3%202HU!5e0!3m2!1sen!2suk!4v1739741907216!5m2!1sen!2suk"*/}
      {/*        width="100%"*/}
      {/*        height="100%"*/}
      {/*        style={{ border: 0 }}*/}
      {/*        allowFullScreen*/}
      {/*        loading="lazy"*/}
      {/*        referrerPolicy="no-referrer-when-downgrade"*/}
      {/*        className="absolute inset-0"*/}
      {/*      />*/}
      {/*    </motion.div>*/}

      {/*    /!* ~ ======= Address Card ======= ~ *!/*/}
      {/*    <motion.div variants={itemVariants}>*/}
      {/*      <Card className="h-full p-6">*/}
      {/*        <div className="flex h-full flex-col gap-6">*/}
      {/*          <div>*/}
      {/*            <h3 className="text-xl font-semibold">Our Address</h3>*/}
      {/*            <p className="mt-2 text-muted-foreground">*/}
      {/*              50 Sargent Gardens,*/}
      {/*              <br />*/}
      {/*              Nottingham,*/}
      {/*              <br />*/}
      {/*              NG3 2HU,*/}
      {/*              <br />*/}
      {/*              United Kingdom*/}
      {/*            </p>*/}
      {/*          </div>*/}

      {/*          <div>*/}
      {/*            <h4 className="font-medium">Business Hours</h4>*/}
      {/*            <div className="mt-2 space-y-2 text-sm text-muted-foreground">*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span>Monday - Friday</span>*/}
      {/*                <span>9:00 AM - 6:00 PM</span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span>Saturday</span>*/}
      {/*                <span>10:00 AM - 4:00 PM</span>*/}
      {/*              </div>*/}
      {/*              <div className="flex justify-between">*/}
      {/*                <span>Sunday</span>*/}
      {/*                <span>Closed</span>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}

      {/*          <Button*/}
      {/*            variant="outline"*/}
      {/*            className="mt-auto"*/}
      {/*            onClick={() =>*/}
      {/*              window.open(*/}
      {/*                "https://goo.gl/maps/QZ5Z5Z5Z5Z5Z5Z5Z5",*/}
      {/*                "_blank",*/}
      {/*              )*/}
      {/*            }*/}
      {/*          >*/}
      {/*            <MapPin className="mr-2 h-4 w-4" />*/}
      {/*            Get Directions*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </Card>*/}
      {/*    </motion.div>*/}
      {/*  </div>*/}
      {/*</motion.section>*/}

      {/* ~ =================================== ~ */}
      {/* -- FAQ Section -- */}
      {/* ~ =================================== ~ */}
      <section className="container mx-auto w-full max-w-7xl py-24">
        {/* ~ ======= FAQ Header ======= ~ */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary dark:text-secondary">
            FAQs
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find answers to common questions about our VoIP services and how we
            can help you.
          </p>
        </div>

        {/* ~ ======= FAQ List ======= ~ */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`border-t ${index === faqs.length - 1 ? "border-b" : ""}`}
            >
              <AccordionTrigger className="py-6 text-base font-normal hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* ~ ======= Still have questions? ======= ~ */}
        <div className="mt-12">
          <h3 className="mb-2 text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-muted-foreground">
            We&apos;re here to help you!
          </p>
          <Button variant="outline" onClick={() => router.push("/contact")}>
            Contact
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
