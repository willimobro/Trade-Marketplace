@_private(sourceFile: "HomeView.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension HomeView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Views/HomeView.swift", line: 12)
        NavigationView  {
        ZStack(){
            HomeBackground(background: $background1)
                VStack(spacing: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[0].value", fallback: 10)){
        ScrollView(.vertical){
                    Navigatior()
                    UploadJobButton()
            HStack{
                Text(__designTimeString("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[2].arg[0].value.[0].arg[0].value", fallback: "Browse"))
                        .font(.custom(__designTimeString("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[2].arg[0].value.[0].modifier[0].arg[0].value.arg[0].value", fallback: "Poppins-SemiBold"), size: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[2].arg[0].value.[0].modifier[0].arg[0].value.arg[1].value", fallback: 28)))
                        .fontWeight(.semibold)
                        .frame(width: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[2].arg[0].value.[0].modifier[2].arg[0].value", fallback: 361), height: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[2].arg[0].value.[0].modifier[2].arg[1].value", fallback: 36), alignment: .leading)
                        .foregroundColor(.white)
                }
                ScrollView(.horizontal){
                    HStack(spacing: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[3].arg[1].value.[0].arg[0].value", fallback: 19)){
                            // change to amount in array sometime
                        ForEach(categorysvariables) { item in
                            Categorys(categorybuttontitle: item.categorytitle, categorybuttoncolor: item.categorycolor, categorybuttonimage: item.categoryimage)
                            
                        }
                            .overlay(
                                GeometryReader { proxy in
                                    Color.clear.preference(key: TabPreferenceKey.self, value: proxy.frame(in: .global).minY)
                                     
                                }
                            )
                            .onPreferenceChange(TabPreferenceKey.self)  {
                                value in background1 = value
                            }
                        }   .frame(height: __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[3].arg[1].value.[0].modifier[0].arg[0].value", fallback: 200), alignment: .leading)
                        
                }.padding(.leading, __designTimeInteger("#7388.[1].[1].property.[0].[0].arg[0].value.[0].arg[0].value.[1].arg[1].value.[0].arg[1].value.[3].modifier[0].arg[1].value", fallback: 10))
                ContentHome()
                    }
                    
                    }
                .edgesIgnoringSafeArea(.bottom)
            }
        }.navigationBarBackButtonHidden(__designTimeBoolean("#7388.[1].[1].property.[0].[0].modifier[0].arg[0].value", fallback: true))
            .navigationBarTitleDisplayMode(.inline)
               .navigationBarHidden(__designTimeBoolean("#7388.[1].[1].property.[0].[0].modifier[2].arg[0].value", fallback: true))
    
#sourceLocation()
    }
}

import struct Trade_Marketplace.HomeView
