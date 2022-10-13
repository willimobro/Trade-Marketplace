@_private(sourceFile: "ContentLanding.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension ContentLanding {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/View Content/ContentLanding.swift", line: 13)
        ZStack{
            Rectangle()
                .foregroundColor(.white)
                .ignoresSafeArea()
            Spacer()
            VStack(spacing: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: 40)) {
                    Text(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].arg[0].value", fallback: "Save Money, \nMake Money."))
                            .font(.largeTitle)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .frame(width: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[0].value", fallback: 321), height: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[0].modifier[3].arg[1].value", fallback: 100), alignment: .bottomLeading)
                            
                    Text(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[1].arg[0].value", fallback: "Trade Marketplace"))
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                            .frame(width: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[1].modifier[3].arg[0].value", fallback: 321), alignment: .leading)
                    Button(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[2].arg[0].value", fallback: "Log In")){
                        selectedbutton = .login
                        
                    }
                                .frame(width: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[2].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[2].modifier[0].arg[1].value", fallback: 55), alignment: .center)
                                .background(Color(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[2].modifier[1].arg[0].value.arg[0].value", fallback: "ButtonColorSL")))
                                .cornerRadius(__designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[2].modifier[2].arg[0].value", fallback: 15))
                                .foregroundColor(.white)
                    Button(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[3].arg[0].value", fallback: "Sign Up")) {
                        selectedbutton = .signup
                        
                    }
                            .padding()
                            .frame(width: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[1].arg[0].value", fallback: 321), height: __designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[1].arg[1].value", fallback: 55), alignment: .center)
                            .background(Color(__designTimeString("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[2].arg[0].value.arg[0].value", fallback: "ButtonColorSL")))
                            .cornerRadius(__designTimeInteger("#42524.[1].[1].property.[0].[0].arg[0].value.[2].arg[1].value.[3].modifier[3].arg[0].value", fallback: 15))
                            .foregroundColor(.white)
            }
    }.frame(width: .infinity, height: .infinity)
    .padding(.top, __designTimeInteger("#42524.[1].[1].property.[0].[0].modifier[1].arg[1].value", fallback: 300))
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.ContentLanding
