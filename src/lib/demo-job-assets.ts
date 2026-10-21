/** Local illustrative stock photographs for explicitly synthetic demo jobs only.
 * These images are not evidence of the job, address, or completed work.
 * Verified source pages, acquisition details and file hashes: docs/demo-assets.md.
 */
export type DemoJobAsset = {
  readonly id: string;
  readonly url: string;
  readonly title: string;
  readonly source: { readonly name: string; readonly url: string; readonly photographer?: string };
  readonly license: { readonly name: string; readonly url: string };
};

export const DEMO_JOB_ASSETS = [
  {
    "id": "kitchen-sink",
    "url": "/demo/jobs/kitchen-sink.jpg",
    "title": "Kitchen sink and tap",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/a-kitchen-with-a-sink-and-a-faucet-NcbU7Etc4mY",
      "photographer": "Bluewater Sweden"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "bathroom-vanity",
    "url": "/demo/jobs/bathroom-vanity.jpg",
    "title": "Bathroom shower and vanity",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/modern-bathroom-with-shower-and-vanity-g51F6-WYzyU",
      "photographer": "Lotus Design N Print"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "timber-fence",
    "url": "/demo/jobs/timber-fence.jpg",
    "title": "Timber boundary fence",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/brown-wooden-fence-under-blue-sky-during-daytime-LVwbWJyOJro",
      "photographer": "Justin Schwartfigure"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "timber-detail",
    "url": "/demo/jobs/timber-detail.jpg",
    "title": "Decking board detail",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/a-close-up-of-a-wooden-surface-with-nails-DKpkc0QQPzs",
      "photographer": "Se. Tsuchiya"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "kitchen-renovation",
    "url": "/demo/jobs/kitchen-renovation.jpg",
    "title": "Kitchen renovation in progress",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/kitchen-renovation-with-white-cabinets-UqNEbyRQ660",
      "photographer": "immo RENOVATION"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "paint-roller",
    "url": "/demo/jobs/paint-roller.jpg",
    "title": "Paint roller and tray",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/paint-roller-in-white-paint-tray-eQ-8iUrb07g",
      "photographer": "Karl Solano"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "ceiling-light",
    "url": "/demo/jobs/ceiling-light.jpg",
    "title": "Ceiling light detail",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/white-dome-light-1vJgJC3De5g",
      "photographer": "莎莉 彭"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "house-exterior",
    "url": "/demo/jobs/house-exterior.jpg",
    "title": "House exterior and garden",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
      "photographer": "todd kent"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "roof-tiles",
    "url": "/demo/jobs/roof-tiles.jpg",
    "title": "Roof tile detail",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/dark-grey-roof-tiles-pattern-m_vEaZizd2s",
      "photographer": "Michael Jasmund"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "garden-shed",
    "url": "/demo/jobs/garden-shed.jpg",
    "title": "Garden shed and tools",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/open-white-garden-shed-with-green-door-and-gardening-supplies-s399fgCQN_s",
      "photographer": "Kailun Zhang"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "deck-patio",
    "url": "/demo/jobs/deck-patio.jpg",
    "title": "Timber deck and patio",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/a-deck-with-chairs-and-tables-on-it-next-to-a-house-adTeb8MrQZs",
      "photographer": "Point3D Commercial Imaging Ltd."
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  },
  {
    "id": "room-renovation",
    "url": "/demo/jobs/room-renovation.jpg",
    "title": "Room renovation in progress",
    "source": {
      "name": "Unsplash",
      "url": "https://unsplash.com/photos/room-renovation-with-metal-support-poles-biRt6RXejuk",
      "photographer": "Stefan Lehner"
    },
    "license": {
      "name": "Unsplash License",
      "url": "https://unsplash.com/license"
    }
  }
] as const satisfies readonly DemoJobAsset[];

export type DemoJobAssetId = (typeof DEMO_JOB_ASSETS)[number]["id"];

export function demoJobAssetForUrl(url: string | null | undefined): DemoJobAsset | undefined {
  return DEMO_JOB_ASSETS.find((asset) => asset.url === url);
}

export function demoJobPhotoUrls(...ids: DemoJobAssetId[]): string[] {
  return ids.map((id) => {
    const asset = DEMO_JOB_ASSETS.find((entry) => entry.id === id);
    if (!asset) throw new Error(`Unknown demo job asset: ${id}`);
    return asset.url;
  });
}
