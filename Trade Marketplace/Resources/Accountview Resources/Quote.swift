import SwiftUI

struct Quote: View {
    @State var isopened = false
    @State var timeago = ""
    var body: some View {
        VStack {
            Image("quotepdf")
                        .resizable()
                        .frame(width: 111, height: 164, alignment: .center)
                        .cornerRadius(11)
                        .shadow(color: .gray, radius: 4, x: 0, y: 4)
                        .overlay(RoundedRectangle(cornerRadius: 11)
                            .fill(.linearGradient(colors: [.clear, isopened ? .gray : Color("logogreen")], startPoint: .top, endPoint: .bottom))
                            .overlay(
                                VStack{
                                    Spacer()
                                    RoundedRectangle(cornerRadius: 11)
                                    .foregroundColor(Color("Homebackgroundgreen"))
                                    .frame(width: 111, height: 48, alignment: .bottom)
                                    .overlay(VStack{
                                        Text("$550 NZD")
                                            .foregroundColor(Color( "logogreen"))
                                            .font(.custom("Poppins-SemiBold", size: 14))
                                        Text("Sub Wires")
                                            .foregroundColor(.white)
                                            .font(.caption)
                                    })
                                    
                                    
                                }
                        ))
            Text("\(timeago)")
                .font(.caption)
                .frame(width: 100, alignment: .leading)
                .foregroundColor(.gray)
        }
    }
}

struct Quote_Previews: PreviewProvider {
    static var previews: some View {
        Quote()
    }
}
