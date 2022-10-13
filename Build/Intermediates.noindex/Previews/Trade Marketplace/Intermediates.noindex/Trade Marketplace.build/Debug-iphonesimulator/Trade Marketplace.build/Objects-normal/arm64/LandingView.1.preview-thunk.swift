@_private(sourceFile: "LandingView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension LandingView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/LandingView.swift", line: 13)
            ZStack{
                BackgroundLogo_Main()
                ContentLanding(selectedbutton: $selectedbutton)
                VStack{
                    Image(__designTimeString("#34928.[1].[1].property.[0].[0].arg[0].value.[2].arg[0].value.[0].arg[0].value", fallback: "greenvan"))
                        .resizable()
                        .frame(width: __designTimeInteger("#34928.[1].[1].property.[0].[0].arg[0].value.[2].arg[0].value.[0].modifier[1].arg[0].value", fallback: 390), height: __designTimeInteger("#34928.[1].[1].property.[0].[0].arg[0].value.[2].arg[0].value.[0].modifier[1].arg[1].value", fallback: 273), alignment: .top)
                        .padding(.top, __designTimeInteger("#34928.[1].[1].property.[0].[0].arg[0].value.[2].arg[0].value.[0].modifier[2].arg[1].value", fallback: 105))
                    Spacer()
                }
            }
            
#sourceLocation()
    }
}

import struct Trade_Marketplace.LandingView
